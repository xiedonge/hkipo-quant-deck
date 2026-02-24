const reveals = document.querySelectorAll(".reveal");
const toast = document.getElementById("toast");
const dataStatus = document.getElementById("data-status");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((el) => observer.observe(el));

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
};

const setDataStatus = (message, type = "ok") => {
  if (!dataStatus) return;
  dataStatus.textContent = message;
  dataStatus.classList.remove("ok", "error");
  dataStatus.classList.add(type);
};

const API_BASE = window.__API_BASE__ || "";
const API_URL = `${API_BASE}/api/ipo`;

const ipoList = document.getElementById("ipo-list");
const reportTitle = document.getElementById("report-title");
const reportSubtitle = document.getElementById("report-subtitle");
const reportBody = document.getElementById("report-body");
const copyButton = document.getElementById("copy-report");

let ipoCalendar = [];
let activeIpo = null;

const safeText = (value, fallback = "待披露") => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text.length ? text : fallback;
};

const formatScore = (score) => {
  if (typeof score !== "number" || Number.isNaN(score)) return "待评估";
  return `${score.toFixed(1)} 分`;
};

const scoreValue = (score) => {
  if (typeof score !== "number" || Number.isNaN(score)) return 50;
  return Math.min(Math.max(score * 10, 0), 100);
};

const buildReportText = (ipo) => {
  const coreData = ipo.coreData || {};
  const dimensions = ipo.dimensions || {};

  return `【${ipo.name} ${ipo.code}】打新综合评估报告\n\n【业务维度概括】\n- 核心业务: ${safeText(ipo.business?.core)}\n- 行业地位: ${safeText(ipo.business?.position)}\n- 营收规模: ${safeText(ipo.business?.revenue)}\n\n【核心数据抓取】\n- 招股价/市值: ${safeText(coreData.priceMarketCap)}\n- 保荐人/稳价人: ${safeText(coreData.sponsorStabilizer)}\n- 基石占比: ${safeText(coreData.cornerstone)}\n- 当前超购倍数: ${safeText(coreData.oversubscription)}\n- 绿鞋/超额配售权: ${safeText(coreData.greenshoe)}\n\n【打中概率关键指标】\n- 发行总手数: ${safeText(coreData.totalShares)}\n- 甲/乙组分配比例: ${safeText(coreData.trancheAllocation)}\n- 预估一手中签率: ${safeText(coreData.lotteryRate)}\n\n【评分维度明细】\n- 基石投资者: ${safeText(dimensions.cornerstone)}\n- 保荐人历史: ${safeText(dimensions.sponsorHistory)}\n- 行业与估值: ${safeText(dimensions.valuation)}\n- 认购热度: ${safeText(dimensions.heat)}\n- 绿鞋/稳价: ${safeText(dimensions.greenshoe)}\n\n【模型评分】\n1. 涨跌概率: ${formatScore(ipo.scores?.up)}\n   逻辑支撑: ${safeText(ipo.logic?.up)}\n2. 打中概率: ${formatScore(ipo.scores?.hit)}\n   逻辑支撑: ${safeText(ipo.logic?.hit)}\n\n【专家操作建议】\n- 申购策略: ${safeText(ipo.strategy?.action)}\n- 风控提示: ${safeText(ipo.strategy?.risk)}`;
};

const renderReport = (ipo) => {
  if (!reportBody || !reportTitle || !reportSubtitle) return;
  const coreData = ipo.coreData || {};
  const dimensions = ipo.dimensions || {};

  reportTitle.textContent = `${ipo.name} (${ipo.code}) 打新综合评估报告`;
  reportSubtitle.textContent = `${safeText(ipo.date, "日期待定")} · ${safeText(ipo.event, "待定")} · ${safeText(
    ipo.status,
    "待定"
  )}`;

  reportBody.innerHTML = `
    <div class="report-section">
      <h4>业务维度概括</h4>
      <div class="report-row">
        <span class="report-label">核心业务</span>
        <span class="report-value">${safeText(ipo.business?.core)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">行业地位</span>
        <span class="report-value">${safeText(ipo.business?.position)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">营收规模</span>
        <span class="report-value">${safeText(ipo.business?.revenue)}</span>
      </div>
    </div>
    <div class="report-section">
      <h4>核心数据抓取</h4>
      <div class="report-row">
        <span class="report-label">招股价/市值</span>
        <span class="report-value">${safeText(coreData.priceMarketCap)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">保荐人/稳价人</span>
        <span class="report-value">${safeText(coreData.sponsorStabilizer)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">基石占比</span>
        <span class="report-value">${safeText(coreData.cornerstone)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">当前超购倍数</span>
        <span class="report-value">${safeText(coreData.oversubscription)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">绿鞋/超额配售</span>
        <span class="report-value">${safeText(coreData.greenshoe)}</span>
      </div>
    </div>
    <div class="report-section">
      <h4>打中概率关键指标</h4>
      <div class="report-row">
        <span class="report-label">发行总手数</span>
        <span class="report-value">${safeText(coreData.totalShares)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">甲/乙组分配比例</span>
        <span class="report-value">${safeText(coreData.trancheAllocation)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">预估一手中签率</span>
        <span class="report-value">${safeText(coreData.lotteryRate)}</span>
      </div>
    </div>
    <div class="report-section">
      <h4>评分维度明细</h4>
      <div class="report-row">
        <span class="report-label">基石投资者</span>
        <span class="report-value">${safeText(dimensions.cornerstone)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">保荐人历史</span>
        <span class="report-value">${safeText(dimensions.sponsorHistory)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">行业与估值</span>
        <span class="report-value">${safeText(dimensions.valuation)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">认购热度</span>
        <span class="report-value">${safeText(dimensions.heat)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">绿鞋/稳价</span>
        <span class="report-value">${safeText(dimensions.greenshoe)}</span>
      </div>
    </div>
    <div class="report-section">
      <h4>模型评分</h4>
      <div class="score-line">
        <div class="score-metric">
          <span>涨跌概率</span>
          <span>${formatScore(ipo.scores?.up)}</span>
        </div>
        <div class="score-bar" style="--score: ${scoreValue(ipo.scores?.up)}"></div>
        <p class="report-note">${safeText(ipo.logic?.up)}</p>
      </div>
      <div class="score-line">
        <div class="score-metric">
          <span>打中概率</span>
          <span>${formatScore(ipo.scores?.hit)}</span>
        </div>
        <div class="score-bar" style="--score: ${scoreValue(ipo.scores?.hit)}"></div>
        <p class="report-note">${safeText(ipo.logic?.hit)}</p>
      </div>
    </div>
    <div class="report-section">
      <h4>专家操作建议</h4>
      <div class="report-row">
        <span class="report-label">申购策略</span>
        <span class="report-value">${safeText(ipo.strategy?.action)}</span>
      </div>
      <div class="report-row">
        <span class="report-label">风控提示</span>
        <span class="report-value">${safeText(ipo.strategy?.risk)}</span>
      </div>
    </div>
  `;
};

const selectIpo = (ipoId) => {
  const target = ipoCalendar.find((item) => item.id === ipoId);
  if (!target) return;
  activeIpo = target;

  document.querySelectorAll(".calendar-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === ipoId);
  });

  renderReport(target);
};

const renderCalendar = () => {
  if (!ipoList) return;
  ipoList.innerHTML = "";

  if (!ipoCalendar.length) {
    ipoList.innerHTML = "<p class=\"muted\">暂无可用的打新数据。</p>";
    return;
  }

  ipoCalendar.forEach((ipo) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "calendar-card";
    card.dataset.id = ipo.id;

    const metaTags = [];
    if (ipo.status) {
      metaTags.push(`<span class=\"status-pill status-${ipo.statusType || "pending"}\">${ipo.status}</span>`);
    }
    if (ipo.sector) {
      metaTags.push(`<span class=\"status-pill calendar-tag\">${ipo.sector}</span>`);
    }
    if (ipo.window) {
      metaTags.push(`<span class=\"status-pill calendar-tag\">${ipo.window}</span>`);
    }

    card.innerHTML = `
      <div class="calendar-date">${safeText(ipo.date, "日期待定")} · ${safeText(ipo.event, "待定")}</div>
      <div class="calendar-name">${safeText(ipo.name, "未命名")}</div>
      <div class="calendar-code">${safeText(ipo.code, "代码待定")}</div>
      <div class="calendar-meta">${metaTags.join("")}</div>
    `;
    card.addEventListener("click", () => selectIpo(ipo.id));
    ipoList.appendChild(card);
  });
};

const loadIpoData = async () => {
  try {
    setDataStatus("数据获取中...", "ok");
    const response = await fetch(API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    if (!payload.items || !payload.items.length) {
      throw new Error("empty");
    }
    ipoCalendar = payload.items;
    renderCalendar();
    selectIpo(ipoCalendar[0].id);
    const sourceText = payload.as_of
      ? `数据来源：${payload.source || "AkShare"} · 更新于 ${payload.as_of}`
      : `数据来源：${payload.source || "AkShare"}`;
    setDataStatus(sourceText, "ok");
  } catch (error) {
    renderCalendar();
    setDataStatus("数据获取失败，请确认后端服务已启动。", "error");
    showToast("实时数据加载失败");
  }
};

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    if (!activeIpo) {
      showToast("请先选择新股");
      return;
    }
    try {
      await navigator.clipboard.writeText(buildReportText(activeIpo));
      showToast("报告已复制");
    } catch (error) {
      showToast("复制失败，请手动选择文本");
    }
  });
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-scroll");
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

loadIpoData();
