# PatentLens Product Search Skill

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt.md)

从一个公开产品链接出发，整理可能相关的专利，并把产品图、专利图纸或权利要求、基本信息和检索缺口放在同一份报告中，供产品经理与研发人员人工判断。

**适合**：新产品立项预筛、现有商品的专利候选排查、供应商权属核对、准备律师审查的证据整理。**不适合**：把关键词命中当侵权结论、正式 FTO 法律意见或仅凭一个页面判定专利已经失效。

## 先看成果

[直接打开中文图示案例](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip.html) · [English case](https://pdben-auto.github.io/patentlens-product-search-skill/synthetic-cable-clip-en.html)

完全虚构的桌面理线夹案例将 36 条模拟线索去重为 19 件，7 件原文可读，3 件进入比较。结果是 1 件观察到的低重合、1 件待核实内部结构、1 件需重点复核视觉重合。文献编号、公司、日期和结论均为虚构。

## 为什么单独做这个 Skill

这个 Skill 解决**从商品页到可核验候选和可读对比**的问题。自动界面能提取产品信息、生成首轮关键词路线、收集部分公开记录与原文、并排查看最多三件候选、记录人工判断、导出 HTML/JSON/CSV。随后按 `SKILL.md` 扩展主体、图像、分类、家族和法律状态核对。

[Design Patent Search and Design Around](https://github.com/PDBen-Auto/design-patent-design-around-skill) 负责更深入的外观设计权范围分析、规避设计和打样后再检索。需要研发改款时从这里交接过去。

| 常见起点 | 本项目的交付 |
| --- | --- |
| 只给一个专利搜索列表 | 保留每条检索路线、来源状态、原文链接和人可读的对比 |
| 自动给单一风险分数 | 将观察到的重合、未知的内部结构、权属与当前法律状态分开 |
| 只看标题和摘要 | 对外观读完整附图；对发明/实用类逐项看权利要求 |
| 只出结论 | 留可编辑判断、导出记录和下一步核验清单 |

## 安装与运行

本仓库根目录就是可安装的 Codex Skill。安装到个人目录：

```powershell
git clone https://github.com/PDBen-Auto/patentlens-product-search-skill.git
$target = "$HOME\.codex\skills\patentlens-product-search"
New-Item -ItemType Directory -Path $target -Force | Out-Null
Get-ChildItem -LiteralPath .\patentlens-product-search-skill -Force |
  Where-Object Name -ne '.git' |
  Copy-Item -Destination $target -Recurse -Force
```

或者在支持 Agent Skills 的环境中使用仓库 URL 安装。重新加载 Skill 列表后，以 `$patentlens-product-search` 调用。使用本地界面需 Node.js 22+。美国官方 PDF 页面渲染还需 Python 3.10+、`pypdf` 和 `pypdfium2`：

```powershell
& "$HOME\.codex\skills\patentlens-product-search\app\setup-pdf.ps1"
& "$HOME\.codex\skills\patentlens-product-search\app\打开专利检索工具.cmd"
```

浏览器默认打开 `http://127.0.0.1:48972`。记录和隔离的 Python 环境默认写入 `$HOME\PatentLens-records`。在 macOS/Linux 上先用 Python 环境安装 `pypdf`、`pypdfium2`，再运行 `node app/server.mjs` 并打开上述本地地址。可通过 `PATENTLENS_PYTHON` 指向已装依赖的 Python。工具不用专利网站账号、不收取 API 费用，但外部页面可能拒绝自动访问，且专利数据覆盖不保证穷尽。

## 一次任务怎么做

1. 提供公开产品链接、目标法域和决策日期；有额外产品视图、型号或供应商信息时一并提供。
2. 启动本地工具，粘贴链接并检索。查看产品识别是否正确；检查每条路线是成功、受阻还是跳过。
3. 在候选页打开原文，勾选最多三件并排看图纸或权利要求，填写逐项人工备注。
4. 导出 HTML/JSON；按 `SKILL.md` 补查权利人、日期、当前状态、期限、缺失视图和供应链主体。未核实项保持 `unknown`。

示例提示词：

> 使用 $patentlens-product-search，分析这个公开产品链接在美国的专利候选。请记录多维检索路线，列出每件候选的申请人、申请/公开/授权日期与期限核对状态，用图示和逐项对照解释相关部位；把已经观察到的低风险与信息不足分开，供我人工判断。

## 能做什么，以及边界

自动检索目前最多六条路线、每路首屏、去重最多四十件，并尝试读取前六件美国官方原文。这是**预筛工作台**，不是全库检索量承诺。默认关键词/公开索引路径不包含真正的图片相似检索；第三方聚合状态不等于当前官方法律状态。Google Patents 可能返回 429/503，工具会记录阻断并尝试公开替代索引；全部来源失败时不会宣称零专利。

本仓库仅公开通用代码和虚构案例，没有原项目的商品链接、客户资料、检索记录或内部评估。权利范围见 [LICENSE](LICENSE)；安装或使用前请确认已获权利人许可，代码可见不等于允许复制、修改或商业再分发。
