const reveals = document.querySelectorAll(".reveal");
const toast = document.getElementById("toast");

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

const ipoCalendar = [
  {
    id: "aurora-tech",
    name: "璟曜智造",
    code: "02618",
    date: "2026-03-05",
    event: "招股开始",
    window: "3月5日-3月8日",
    status: "招股中",
    statusType: "open",
    sector: "先进制造",
    business: {
      core: "为新能源车提供高功率驱动模组与热管理系统，收入来自整机配套与售后服务。",
      position: "国内前三驱动模组供应商，海外客户占比提升，具备规模化交付能力。",
      revenue: "近三年营收复合增速约28%，利润率稳定在12%上下。",
    },
    coreData: {
      priceMarketCap: "招股价 HK$12.8-15.4 / 市值约 HK$68 亿",
      sponsorStabilizer: "中金 / 摩根士丹利（稳价人：中金）",
      cornerstone: "约 45%（国资产业基金 + 头部整车厂）",
      oversubscription: "预计 80-120 倍",
    },
    scores: { up: 7.9, hit: 5.6 },
    logic: {
      up: "基石占比偏高且结构稳定，估值较同类制造业公司折让约10%，保荐人首日胜率中上。",
      hit: "发行规模中等且回拨可能性高，预计一手中签率在7%-10%。",
    },
    strategy: {
      action: "融资申购",
      risk: "行业景气受下游车企资本开支影响，情绪转弱时存在破发风险。",
    },
  },
  {
    id: "harbor-logistics",
    name: "启曜物流",
    code: "02471",
    date: "2026-03-18",
    event: "上市日",
    window: "3月10日-3月13日",
    status: "上市在即",
    statusType: "listed",
    sector: "供应链",
    business: {
      core: "聚焦跨境电商仓配与港口短驳服务，收入以履约物流与仓储管理为主。",
      position: "华南跨境仓配头部玩家，客户集中于头部电商平台与品牌方。",
      revenue: "近三年营收增速约18%，毛利率稳定在20%左右。",
    },
    coreData: {
      priceMarketCap: "招股价 HK$6.2-7.1 / 市值约 HK$34 亿",
      sponsorStabilizer: "中信 / 招银国际（稳价人：中信）",
      cornerstone: "约 30%（大型物流集团 + 产业基金）",
      oversubscription: "预计 35-50 倍",
    },
    scores: { up: 6.8, hit: 4.2 },
    logic: {
      up: "估值与同业基本持平，基石占比一般，保荐人护盘风格偏稳健。",
      hit: "货源有限且回拨空间小，中签率预计在4%-6%。",
    },
    strategy: {
      action: "现金申购",
      risk: "行业价格战持续，若订单增长不及预期将压缩利润率。",
    },
  },
  {
    id: "nova-bio",
    name: "映潮生科",
    code: "02836",
    date: "2026-03-26",
    event: "招股截止",
    window: "3月22日-3月26日",
    status: "招股中",
    statusType: "open",
    sector: "生物科技",
    business: {
      core: "专注肿瘤免疫与细胞治疗平台，收入来自授权合作与临床服务。",
      position: "临床管线丰富，多个项目进入 II 期，行业内处于第一梯队。",
      revenue: "当前营收规模较小，研发投入占比高，亏损收敛趋势明确。",
    },
    coreData: {
      priceMarketCap: "招股价 HK$21.0-24.5 / 市值约 HK$120 亿",
      sponsorStabilizer: "高盛 / 华泰国际（稳价人：高盛）",
      cornerstone: "约 55%（全球医疗基金 + 产业龙头）",
      oversubscription: "预计 150-220 倍",
    },
    scores: { up: 8.3, hit: 3.2 },
    logic: {
      up: "顶级基石占比高且行业景气支撑，估值折价明显，但波动性较强。",
      hit: "热度高、超购倍数大且回拨受限，一手中签率或低于3%。",
    },
    strategy: {
      action: "小额融资或搏击申购",
      risk: "生物科技监管与临床结果不确定性高，破发概率需严控。",
    },
  },
  {
    id: "green-energy",
    name: "霁航能源",
    code: "02752",
    date: "2026-04-02",
    event: "招股开始",
    window: "4月2日-4月7日",
    status: "即将开启",
    statusType: "upcoming",
    sector: "新能源",
    business: {
      core: "提供储能系统集成与海外电网解决方案，收入来自项目交付与运维。",
      position: "海外订单占比持续提升，具备系统集成与软件协同能力。",
      revenue: "近三年营收复合增速超35%，现金流改善明显。",
    },
    coreData: {
      priceMarketCap: "招股价 HK$9.8-11.6 / 市值约 HK$52 亿",
      sponsorStabilizer: "瑞银 / 国泰君安国际（稳价人：瑞银）",
      cornerstone: "约 38%（央企新能源基金 + 战略客户）",
      oversubscription: "预计 60-90 倍",
    },
    scores: { up: 7.2, hit: 5.0 },
    logic: {
      up: "行业景气度高，估值处于合理区间，保荐人护盘风格积极。",
      hit: "发行规模偏大，回拨空间充足，中签率预计在6%-8%。",
    },
    strategy: {
      action: "现金申购",
      risk: "海外项目交付节奏存在波动，需关注汇率与政策风险。",
    },
  },
];

const ipoList = document.getElementById("ipo-list");
const reportTitle = document.getElementById("report-title");
const reportSubtitle = document.getElementById("report-subtitle");
const reportBody = document.getElementById("report-body");
const copyButton = document.getElementById("copy-report");

let activeIpo = null;

const formatScore = (score) => Number(score).toFixed(1);

const buildReportText = (ipo) => {
  return `【${ipo.name} ${ipo.code}】打新综合评估报告\n\n【业务维度概括】\n- 核心业务: ${ipo.business.core}\n- 行业地位: ${ipo.business.position}\n- 营收规模: ${ipo.business.revenue}\n\n【核心数据抓取】\n- 招股价/市值: ${ipo.coreData.priceMarketCap}\n- 保荐人/稳价人: ${ipo.coreData.sponsorStabilizer}\n- 基石占比: ${ipo.coreData.cornerstone}\n- 当前超购倍数: ${ipo.coreData.oversubscription}\n\n【模型评分】\n1. 涨跌概率: ${formatScore(ipo.scores.up)} 分\n   逻辑支撑: ${ipo.logic.up}\n2. 打中概率: ${formatScore(ipo.scores.hit)} 分\n   逻辑支撑: ${ipo.logic.hit}\n\n【专家操作建议】\n- 申购策略: ${ipo.strategy.action}\n- 风控提示: ${ipo.strategy.risk}`;
};

const renderReport = (ipo) => {
  if (!reportBody || !reportTitle || !reportSubtitle) return;
  reportTitle.textContent = `${ipo.name} (${ipo.code}) 打新综合评估报告`;
  reportSubtitle.textContent = `${ipo.date} · ${ipo.event} · ${ipo.status}`;

  reportBody.innerHTML = `
    <div class="report-section">
      <h4>业务维度概括</h4>
      <div class="report-row">
        <span class="report-label">核心业务</span>
        <span class="report-value">${ipo.business.core}</span>
      </div>
      <div class="report-row">
        <span class="report-label">行业地位</span>
        <span class="report-value">${ipo.business.position}</span>
      </div>
      <div class="report-row">
        <span class="report-label">营收规模</span>
        <span class="report-value">${ipo.business.revenue}</span>
      </div>
    </div>
    <div class="report-section">
      <h4>核心数据抓取</h4>
      <div class="report-row">
        <span class="report-label">招股价/市值</span>
        <span class="report-value">${ipo.coreData.priceMarketCap}</span>
      </div>
      <div class="report-row">
        <span class="report-label">保荐人/稳价人</span>
        <span class="report-value">${ipo.coreData.sponsorStabilizer}</span>
      </div>
      <div class="report-row">
        <span class="report-label">基石占比</span>
        <span class="report-value">${ipo.coreData.cornerstone}</span>
      </div>
      <div class="report-row">
        <span class="report-label">当前超购倍数</span>
        <span class="report-value">${ipo.coreData.oversubscription}</span>
      </div>
    </div>
    <div class="report-section">
      <h4>模型评分</h4>
      <div class="score-line">
        <div class="score-metric">
          <span>涨跌概率</span>
          <span>${formatScore(ipo.scores.up)} 分</span>
        </div>
        <div class="score-bar" style="--score: ${ipo.scores.up * 10}"></div>
        <p class="report-note">${ipo.logic.up}</p>
      </div>
      <div class="score-line">
        <div class="score-metric">
          <span>打中概率</span>
          <span>${formatScore(ipo.scores.hit)} 分</span>
        </div>
        <div class="score-bar" style="--score: ${ipo.scores.hit * 10}"></div>
        <p class="report-note">${ipo.logic.hit}</p>
      </div>
    </div>
    <div class="report-section">
      <h4>专家操作建议</h4>
      <div class="report-row">
        <span class="report-label">申购策略</span>
        <span class="report-value">${ipo.strategy.action}</span>
      </div>
      <div class="report-row">
        <span class="report-label">风控提示</span>
        <span class="report-value">${ipo.strategy.risk}</span>
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

  ipoCalendar.forEach((ipo) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "calendar-card";
    card.dataset.id = ipo.id;
    card.innerHTML = `
      <div class="calendar-date">${ipo.date} · ${ipo.event}</div>
      <div class="calendar-name">${ipo.name}</div>
      <div class="calendar-code">${ipo.code}</div>
      <div class="calendar-meta">
        <span class="status-pill status-${ipo.statusType}">${ipo.status}</span>
        <span class="status-pill calendar-tag">${ipo.sector}</span>
        <span class="status-pill calendar-tag">${ipo.window}</span>
      </div>
    `;
    card.addEventListener("click", () => selectIpo(ipo.id));
    ipoList.appendChild(card);
  });
};

renderCalendar();
if (ipoCalendar.length > 0) {
  selectIpo(ipoCalendar[0].id);
}

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
