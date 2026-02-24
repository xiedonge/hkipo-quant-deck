from __future__ import annotations

from datetime import date, datetime
import math
import re
import time
from typing import Any, Dict, List, Optional, Tuple

from fastapi import FastAPI, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

try:
    import akshare as ak
    import pandas as pd
except Exception:  # pragma: no cover - runtime dependency check
    ak = None  # type: ignore
    pd = None  # type: ignore


app = FastAPI(title="HK IPO Calendar API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE_TTL_SECONDS = 300
_CACHE: Dict[str, Any] = {"ts": 0.0, "items": [], "source": "AkShare stock_hk_ipo_get"}


def _is_empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, float) and math.isnan(value):
        return True
    if pd is not None:
        try:
            if pd.isna(value):
                return True
        except Exception:
            pass
    text = str(value).strip()
    return text in {"", "nan", "NaT", "None"}


def _find_column(columns: List[str], candidates: List[str]) -> Optional[str]:
    for candidate in candidates:
        for col in columns:
            if col == candidate:
                return col
        for col in columns:
            if candidate in col:
                return col
    return None


def _parse_date(value: Any) -> Optional[date]:
    if _is_empty(value):
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    text = str(value).strip()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%Y.%m.%d", "%Y%m%d"):
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    match = re.search(r"(\d{4})\D+(\d{1,2})\D+(\d{1,2})", text)
    if match:
        year, month, day = match.groups()
        try:
            return date(int(year), int(month), int(day))
        except ValueError:
            return None
    return None


def _parse_window(value: Any) -> Tuple[Optional[date], Optional[date]]:
    if _is_empty(value):
        return None, None
    text = str(value)
    matches = re.findall(r"(\d{4})\D{0,3}(\d{1,2})\D{0,3}(\d{1,2})", text)
    if len(matches) >= 2:
        start = _parse_date("-".join(matches[0]))
        end = _parse_date("-".join(matches[1]))
        return start, end
    if len(matches) == 1:
        single = _parse_date("-".join(matches[0]))
        return single, None
    return None, None


def _format_date(value: Optional[date]) -> str:
    return value.isoformat() if value else ""


def _safe_value(value: Any) -> str:
    if _is_empty(value):
        return ""
    if isinstance(value, (datetime, date)):
        return _format_date(value if isinstance(value, date) else value.date())
    return str(value).strip()


def _combine_price_market(price: str, market_cap: str) -> str:
    if price and market_cap:
        return f"{price} / {market_cap}"
    return price or market_cap


def _compute_status(start: Optional[date], end: Optional[date], listed: Optional[date]) -> Tuple[str, str]:
    today = date.today()
    if start and end and start <= today <= end:
        return "招股中", "open"
    if start and today < start:
        return "即将开启", "upcoming"
    if listed and today >= listed:
        return "已上市", "listed"
    return "待定", "pending"


def _normalize_items(df) -> List[Dict[str, Any]]:
    columns = [str(col) for col in df.columns]

    col_map = {
        "code": _find_column(columns, ["股票代码", "证券代码", "代码", "代号", "股份代号"]),
        "name": _find_column(columns, ["股票简称", "股票名称", "简称", "公司名称", "名称"]),
        "start": _find_column(
            columns,
            [
                "招股开始",
                "招股开始日",
                "招股起始日",
                "开始日期",
                "申购开始",
                "开始申购",
            ],
        ),
        "end": _find_column(
            columns,
            [
                "招股结束",
                "招股截止",
                "招股结束日",
                "结束日期",
                "申购截止",
                "截止日期",
            ],
        ),
        "window": _find_column(columns, ["招股日期", "招股期", "申购日期", "招股时间"]),
        "list": _find_column(columns, ["上市日期", "上市日", "挂牌日期", "挂牌日", "交易日期"]),
        "price": _find_column(
            columns,
            ["招股价", "发行价", "发售价", "发售价区间", "招股价范围", "发行价(港元)"],
        ),
        "market_cap": _find_column(columns, ["市值", "发行市值", "总市值", "预期市值"]),
        "sponsor": _find_column(columns, ["保荐人", "保荐", "保荐人/稳价人", "保荐人及稳价人"]),
        "industry": _find_column(columns, ["行业", "所属行业", "板块", "行业类别"]),
        "cornerstone": _find_column(columns, ["基石", "基石投资者", "基石占比"]),
        "oversub": _find_column(columns, ["超购", "认购倍数", "融资倍数", "孖展倍数", "超额认购"]),
    }

    items: List[Dict[str, Any]] = []

    for idx, row in df.iterrows():
        name = _safe_value(row.get(col_map["name"])) if col_map["name"] else ""
        code = _safe_value(row.get(col_map["code"])) if col_map["code"] else ""
        industry = _safe_value(row.get(col_map["industry"])) if col_map["industry"] else ""

        start = _parse_date(row.get(col_map["start"])) if col_map["start"] else None
        end = _parse_date(row.get(col_map["end"])) if col_map["end"] else None

        if (start is None or end is None) and col_map["window"]:
            window_start, window_end = _parse_window(row.get(col_map["window"]))
            start = start or window_start
            end = end or window_end

        listed = _parse_date(row.get(col_map["list"])) if col_map["list"] else None

        event = "待定"
        event_date = None
        if start:
            event = "招股开始"
            event_date = start
        elif end:
            event = "招股截止"
            event_date = end
        elif listed:
            event = "上市日"
            event_date = listed

        status, status_type = _compute_status(start, end, listed)

        price_value = _safe_value(row.get(col_map["price"])) if col_map["price"] else ""
        market_value = _safe_value(row.get(col_map["market_cap"])) if col_map["market_cap"] else ""
        price_market = _combine_price_market(price_value, market_value) or "招股价/市值待披露"

        sponsor_value = (
            _safe_value(row.get(col_map["sponsor"])) if col_map["sponsor"] else "保荐人/稳价人待披露"
        )
        cornerstone_value = (
            _safe_value(row.get(col_map["cornerstone"])) if col_map["cornerstone"] else "基石占比待披露"
        )
        oversub_value = (
            _safe_value(row.get(col_map["oversub"])) if col_map["oversub"] else "超购倍数待披露"
        )

        business_core = (
            f"主要从事{industry}相关业务，详细业务以招股书披露为准。" if industry else "核心业务待披露。"
        )

        raw = jsonable_encoder(row.to_dict())

        items.append(
            {
                "id": f"{code or name or 'ipo'}-{idx}",
                "name": name or "未命名",
                "code": code or "待定",
                "date": _format_date(event_date),
                "event": event,
                "window": " - ".join(filter(None, [_format_date(start), _format_date(end)])) or "待定",
                "status": status,
                "statusType": status_type,
                "sector": industry or "未分类",
                "business": {
                    "core": business_core,
                    "position": "行业地位待招股书披露。",
                    "revenue": "财务披露待补充。",
                },
                "coreData": {
                    "priceMarketCap": price_market,
                    "sponsorStabilizer": sponsor_value,
                    "cornerstone": cornerstone_value,
                    "oversubscription": oversub_value,
                },
                "scores": {"up": 5.0, "hit": 5.0},
                "logic": {
                    "up": "缺少基石/估值/保荐人历史等关键数据，暂以中性分预估。",
                    "hit": "缺少认购倍数与回拨数据，暂以中性分预估。",
                },
                "strategy": {
                    "action": "观望或小额申购",
                    "risk": "信息不足，需等待招股书与市场热度数据补充。",
                },
                "raw": raw,
            }
        )

    return items


def _get_cached_items(refresh: bool) -> Dict[str, Any]:
    now = time.time()
    if not refresh and _CACHE["items"] and now - _CACHE["ts"] < CACHE_TTL_SECONDS:
        return {"items": _CACHE["items"], "source": _CACHE["source"]}

    if ak is None:
        raise HTTPException(status_code=500, detail="AkShare 未安装，请先安装依赖。")

    try:
        df = ak.stock_hk_ipo_get()
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=502, detail=f"AkShare 数据获取失败: {exc}") from exc

    if df is None or df.empty:
        _CACHE.update({"ts": now, "items": []})
        return {"items": []}

    items = _normalize_items(df)
    _CACHE.update({"ts": now, "items": items})
    return {"items": items, "source": _CACHE["source"]}


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/api/ipo")
def get_ipo_calendar(
    refresh: bool = Query(False, description="强制刷新缓存"),
    limit: int = Query(50, ge=1, le=200, description="返回条目数量"),
) -> Dict[str, Any]:
    payload = _get_cached_items(refresh)
    items = payload.get("items", [])

    return {
        "source": payload.get("source", "AkShare"),
        "as_of": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "count": min(len(items), limit),
        "items": items[:limit],
    }
