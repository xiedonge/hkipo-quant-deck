# 港股新股量化决策专家（单页网站）

本项目是一个以“港股新股量化决策专家”为主题的单页展示网站，聚焦 IPO 业务解读、评分模型与申购策略输出，适合用于产品原型展示与研究报告落地页。

## 亮点
- 结构化展示：Profile、Goals、Methodology、Workflow、Output 模板
- 视觉风格：金融分析仪表盘风格，深色渐变背景与数据卡片
- 交互体验：滚动显隐动画、模板一键复制
- 数据接口建议：内置“免费/低门槛”数据源说明（AkShare）

## 页面结构
- Hero：角色与能力概述、评分卡片
- Profile：作者、版本、语言与角色说明
- Goals：三大目标
- Methodology：涨跌概率与打中概率模型
- Workflow：执行流程
- Data API：免费/低门槛接口建议
- Output：报告模板与核心数据抓取项

## 技术栈
- HTML / CSS / JavaScript
- 无框架，便于快速部署

## 本地使用
直接打开 `index.html` 即可预览。

## 数据接口（免费/低门槛）
- 社区型开源接口（推荐初期使用）
- AkShare（Python 库）
  - 优点：免费、开源、Python 直接调用
  - 相关接口：`stock_hk_ipo_get`

## 文件说明
- `index.html` 页面结构
- `styles.css` 视觉样式
- `script.js` 交互脚本
- `task.md` 原始需求说明

## 许可
如需开源许可，可选择添加 MIT 等协议。
