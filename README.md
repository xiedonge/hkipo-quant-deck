# 港股新股量化决策专家（单页网站 + 实时数据）

本项目是一个以“港股新股量化决策专家”为主题的单页展示网站，包含打新日历与动态报告面板，并通过 AkShare 实时获取港股 IPO 数据。

## 亮点
- 打新日历：点击新股生成对应评估报告
- 动态数据：后端接口从 AkShare 拉取 IPO 数据
- 全字段报告：覆盖基石、保荐人历史、估值、热度、绿鞋、发行规模与中签率等关键字段
- 交互体验：滚动显隐动画、报告一键复制
- 视觉风格：金融分析仪表盘风格，深色渐变背景与数据卡片

## 页面结构
- Hero：角色与能力概述、评分卡片
- Goals：三大目标
- Methodology：涨跌概率与打中概率模型
- Workflow：执行流程
- 打新日历：新股日历 + 报告生成面板

## 报告字段覆盖
- 业务维度：核心业务、行业地位、营收规模
- 核心数据：招股价/市值、保荐人/稳价人、基石占比、超购倍数、绿鞋/超额配售
- 打中概率关键指标：发行总手数、甲/乙组分配比例、预估一手中签率
- 评分维度明细：基石投资者、保荐人历史、行业与估值、认购热度、绿鞋/稳价
- 模型评分与策略建议

## 后端接口
后端基于 FastAPI，调用 AkShare 的 `stock_hk_ipo_get` 获取 IPO 列表并做结构化输出。

### 接口
- `GET /api/health`
- `GET /api/ipo?refresh=1&limit=50`

说明：
- `refresh=1` 可强制刷新缓存（默认 5 分钟缓存）
- `limit` 控制返回条数

## 本地运行
1. 安装依赖
   ```bash
   python3 -m venv .venv
   .venv/bin/pip install -r requirements.txt
   ```
2. 启动后端
   ```bash
   .venv/bin/uvicorn backend.app:app --reload --port 8000
   ```
3. 打开 `index.html`
   - 默认请求同域 `/api/ipo`
   - 若前后端分离，可在 `index.html` 中加入：
     ```html
     <script>window.__API_BASE__ = "http://localhost:8000";</script>
     ```

## 文件说明
- `index.html` 页面结构
- `styles.css` 视觉样式
- `script.js` 前端逻辑（请求 `/api/ipo` 并渲染报告）
- `backend/app.py` 后端 API
- `requirements.txt` 后端依赖
- `task.md` 原始需求说明

## 许可
如需开源许可，可选择添加 MIT 等协议。
