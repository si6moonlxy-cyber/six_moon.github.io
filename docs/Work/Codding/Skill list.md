# Codex Agent Skills 清单

> 本文档记录我当前安装的全部 **Codex Agent Skills**，按目录层级分为 9 个分类，共 **56 个 Skill**。每条包含名称、一句话描述、触发关键词和典型使用场景，方便根据任务需求快速检索合适的 Skill。

**我的身份**：软件工程应届生，目标方向为游戏行业 AI 产品 / 项目经理。
**工具链**：Claude Code (小c) + Codex (coke) + Workbuddy (小猫) + VS Code + Obsidian + GitHub。

**Skills 机制简介**：Skill 是 Codex Agent 的扩展能力模块，每个 Skill 对应一个 `SKILL.md` 文件，定义触发规则、工作流和约束。当我的指令命中某个 Skill 的触发词时，Agent 自动加载该 Skill 的规则执行任务——无需手动选择。

**如何使用本清单**：
- **查找**：在页面内搜索 (`Ctrl+F`) 你的需求关键词，如 "PRD"、"debug"、"原型"。
- **触发**：在对话中自然提及触发词即可，无需说 "使用 XX skill"。
- **不纳入范围**：Browser、Documents、Presentations、Spreadsheets 四个 Codex 内置插件属于平台能力，不在本清单。

## 分类总览

| #   | 分类          | 说明     | 数量  |
| --- | ----------- | ------ | --- |
| 1   | `.system`   | 系统工具   | 5   |
| 2   | `caveman`   | 高效通信   | 4   |
| 3   | `pm-skills` | 产品经理   | 13  |
| 4   | `ai`        | AI 工具  | 3   |
| 5   | `devops`    | DevOps | 2   |
| 6   | `coding`    | 编码工具   | 4   |
| 7   | `writing`   | 写作与文档  | 6   |
| 8   | `product`   | 产品与策略  | 14  |
| 9   | `local`     | 本地工具   | 5   |

---

## .system — 系统工具

> **imagegen** — 生成/编辑位图
> - 作用：生成或编辑 AI 位图图像，支持照片、插画、纹理、精灵图、透明背景等。使用 ImageGen API，理解尺寸、比例、压缩等参数。
> - 触发词：生成图片、画一张、bitmap、generate image
> - 场景：需要创建视觉资产时——产品 mockup、角色设计、纹理素材、透明背景贴图

> **openai-docs** — OpenAI 文档查询
> - 作用：查询 OpenAI 产品/API 最新官方文档，支持 SDK、API 参数、Codex 平台能力等。
> - 触发词：OpenAI API、Codex 怎么用、platform docs
> - 场景：构建与 OpenAI 产品集成时、不确定 API 参数时、需要查阅 Codex 平台文档时

> **plugin-creator** — 插件脚手架
> - 作用：创建和搭建 Codex 插件目录结构，生成必需的 `.codex-plugin/plugin.json` 及可选文件夹。
> - 触发词：创建插件、plugin scaffold、新建插件
> - 场景：扩展 Codex 平台能力，将自定义 Skill / MCP / App 打包为插件

> **skill-creator** — 创建 Skill
> - 作用：指导创建有效的 Skill，包括 proper structure、progressive disclosure、bundled resources。
> - 触发词：创建 skill、写个 skill、新建技能
> - 场景：为重复性任务编写可复用的 Agent 能力扩展

> **skill-installer** — 安装 Skill
> - 作用：从 curated list 或 GitHub repo 安装社区/官方 Skill 到 `$CODEX_HOME/skills`。
> - 触发词：安装 skill、list installable skills、install skill from GitHub
> - 场景：引入第三方 Skill 扩展 Agent 能力

---

## caveman — 高效通信

> **caveman** — 超压缩通信模式
> - 作用：将 Agent 输出 token 压缩约 75%，保留全部技术精度。支持 lite / full / ultra / wenyan 等多级强度。
> - 触发词：caveman mode、talk like caveman、less tokens、be brief、/caveman
> - 场景：长对话 token 预算紧张时、需要极简技术回复时、快速迭代讨论时

> **caveman-compress** — 记忆文件压缩
> - 作用：将自然语言记忆文件（CLAUDE.md、todos、preferences）压缩为 caveman 格式，减少输入 token。
> - 触发词：compress memory、caveman compress
> - 场景：记忆文件过大导致 token 开销高，需要精简持久上下文

> **caveman-stats** — Token 用量统计
> - 作用：展示当前会话的真实 token 用量和估计节省量，直接从会话日志读取而非 AI 估算。
> - 触发词：/caveman-stats
> - 场景：监控会话 token 效率，验证压缩效果

> **cavecrew** — 子代理委派决策
> - 作用：指导何时 spawn `cavecrew-investigator`（定位代码）和 `cavecrew-builder`（1-2 文件编辑）。
> - 触发词：spawn subagent、委派任务、cavecrew
> - 场景：大型代码库中需要并行搜索/编辑时

---

## pm-skills — 产品经理

> **SPACE-analytics** — 数据分析
> - 作用：从数据现象出发，生成可执行的产品决策建议，输出 HTML 可视化报告。
> - 触发词：分析数据、这个指标为什么跌了、留存分析、漏斗分析、用户流失原因
> - 场景：CSV/Excel 数据上传后需要洞察分析、SQL 查询结果需要可视化

> **SPACE-competitor-deconstructor** — 竞品拆解
> - 作用：按策略/功能/体验/增长四维度结构化拆解竞品，输出可借鉴点与差异化建议。
> - 触发词：竞品分析、帮我分析竞品、competitor analysis、对标分析
> - 场景：给出竞品名单要求系统化分析、需要差异化策略

> **SPACE-experiment-designer** — A/B 实验设计
> - 作用：从实验目标输出完整实验方案——假设、分组、指标体系、样本量估算、止损规则、判定规则。
> - 触发词：AB 测试、实验设计、样本量计算、显著性检验、p 值、MDE
> - 场景：灰度方案设计、功能上线前效果评估规划

> **SPACE-image2pencil** — 截图转设计稿
> - 作用：将 UI 截图/设计稿复刻为 Pencil .pen 设计文件，同时输出结构化设计文档。
> - 触发词：按图复刻、image to pencil、照着截图画页面
> - 场景：从设计交付截图快速生成可编辑设计源文件

> **SPACE-image2proto** — 截图转 HTML 原型
> - 作用：将 UI 截图、mockup、线框图转为可交互 HTML 原型，支持迭代修改和学习记忆。
> - 触发词：照这个做原型、convert mockup to HTML、帮我出个原型、加一个字段
> - 场景：任何有 UI 截图的对话中，需要快速产出可交互前端原型

> **SPACE-postmortem-writer** — 上线复盘
> - 作用：生成结构化上线复盘报告——目标达成、偏差原因、经验沉淀、责任归因和改进 owner。
> - 触发词：写复盘、项目复盘、postmortem、版本回顾、迭代总结
> - 场景：版本发布后 / 事故后需要结构化总结与改进跟踪

> **SPACE-prd-writer** — PRD 写作
> - 作用：把模糊需求转化为可评审的产品需求文档（PRD），四阶段流程：澄清→结构化→补漏→验收。
> - 触发词：写个需求文档、帮我出 PRD、这个功能怎么写需求、需求评审
> - 场景：原始需求描述/会议纪要/聊天截图需要整理为正式 PRD

> **SPACE-prioritization-engine** — 优先级排序
> - 作用：对需求/功能/项目进行多维度优先级排序，支持 RICE / ICE / Kano / 成本收益多种模型。
> - 触发词：排优先级、RICE 打分、Kano 分析、哪些先做哪些后做
> - 场景：一批需求/功能/项目需要决策执行顺序

> **SPACE-review-board** — 多角色 PRD 评审
> - 作用：模拟产品/研发/测试/设计/运营/法务六角色对 PRD/原型进行评审，输出查漏补缺结论。
> - 触发词：评审 PRD、模拟评审会、review 文档、这个需求能不能过评审
> - 场景：PRD 完成后需要多视角审查偏漏

> **SPACE-roadmap-planner** — 路线图规划
> - 作用：从季度目标/团队产能/依赖方信息输出版本路线图——里程碑、依赖风险、缓冲策略、成功指标。
> - 触发词：路线图、roadmap、里程碑、季度计划、版本排期
> - 场景：多项目/多迭代排期与依赖梳理

> **SPACE-survey-designer** — 调研问卷
> - 作用：设计高质量调研问卷，含题目草稿、选项设计、逻辑跳转、偏差警告。
> - 触发词：设计问卷、做个调研、NPS 问卷、用户调研、满意度调查
> - 场景：需要快速产出专业级调研问卷

> **SPACE-tracking-spec-writer** — 埋点设计
> - 作用：从产品需求/核心链路输出完整埋点方案——事件、字段、触发时机、口径说明、QA 校验清单。
> - 触发词：埋点、tracking、事件设计、数据采集、上报方案
> - 场景：新功能上线前需要完整埋点规划

> **SPACE-url2proto** — URL 转原型
> - 作用：将线上网页克隆为本地 Next.js + Tailwind CSS 原型项目，支持快速迭代。
> - 触发词：clone this page、replicate website、url to prototype
> - 场景：参考竞品页面快速生成本地可编辑原型

---

## ai — AI 工具

> **ai-coding-design-guard** — UI 设计规范守卫
> - 作用：执行 AI 编程规则，使应用实现与设计交付包保持一致——设计令牌、组件清单、禁止更改规则、页面结构审查。
> - 触发词：UI 实现、设计交付、设计令牌、组件清单、禁止更改
> - 场景：根据产品设计文件/设计截图/风格指南生成或审查前端代码时

> **ai-expert-agent** — AI 专家助手
> - 作用：AI 智能工作流——处理 AI 模型/Agent/RAG/LLM 产品/AI 工程/基准/论文等问题。实时网页搜索 + 本地知识日志。
> - 触发词：AI 最新进展、模型对比、Agent 架构、RAG 方案、AI 论文解读、AI 产品规划
> - 场景：需要 AI 领域最新信息或知识索引时

> **concise-critical-responder** — 简洁严谨回答
> - 作用：执行低 token、高置信度回答规范——去除填充词、显式置信度门控（<90% 时提问）、对抗性逻辑检查。
> - 触发词：简洁回答、高置信度、去除废话、逻辑检查、对抗性思考
> - 场景：需要 Agent 输出最精炼且经过自我审查的结论时

---

## devops — DevOps

> **agent-devops-thesis-helper** — DevOps 论文助手
> - 作用：帮助实现、验证和记录论文相关的 DevOps 平台功能，维护代码/功能笔记/论文需求/数据库/部署的关联。
> - 触发词：DevOps、论文、毕业设计、交付指标、效能度量
> - 场景：毕设 DevOps 平台的核心开发与文档维护

> **witness** — DevOps 变更审查
> - 作用：审查/监督 DevOps 交付指标平台的未来变更——UI 删除、微服务、仪表板、权限、数据源、版本说明。
> - 触发词：review changes、监督变更、DevOps 项目、UI 删除审查
> - 场景：DevOps 平台任何变更前需要合规审查

---

## coding — 编码工具

> **chatgpt-apps** — ChatGPT Apps 开发
> - 作用：构建、脚手架、重构和调试 ChatGPT Apps SDK 应用（MCP server + widget UI）。
> - 触发词：ChatGPT App、MCP server、widget UI、Apps SDK
> - 场景：开发 ChatGPT 扩展应用时

> **cli-creator** — CLI 工具构建
> - 作用：从 API 文档/OpenAPI spec/curl 示例/SDK/Web App 构建可组合的 Codex CLI 工具。
> - 触发词：create CLI、build command-line tool、生成命令行工具
> - 场景：需要将某 API 或脚本封装为可复用的 CLI

> **tdd** — 测试驱动开发
> - 作用：Red-Green-Refactor 循环——先写测试→让测试失败→写最小实现→通过→重构。
> - 触发词：TDD、red-green-refactor、test-first、先写测试
> - 场景：要求高质量/高覆盖率地构建功能或修复 bug

> **prototype** — 快速原型
> - 作用：在正式设计前构建一次性原型——terminal app for 业务逻辑 or web UI for 交互验证。
> - 触发词：build prototype、throwaway prototype、快速原型
> - 场景：方案设计阶段需要可运行的验证原型

---

## writing — 写作与文档

> **generate-prd** — 生成中文 PRD
> - 作用：严格按模板生成固定六章结构的中文 PRD，含防幻觉处理与格式自检。
> - 触发词：生成 PRD、需求文档、product requirement document
> - 场景：输入不足/资料冲突时需要严谨的结构化 PRD 输出

> **humanizer** — AI 痕迹去除
> - 作用：移除文本中的 AI 生成痕迹，基于 Wikipedia 综合审查原则，让文字更自然。
> - 触发词：humanize、去除 AI 痕迹、natural writing、像人写的
> - 场景：AI 生成的文案/文章/邮件在发布前需要降 AI 感

> **guizang-ppt-skill** — 网页 PPT
> - 作用：生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等。提供"电子杂志×电子墨水"和"瑞士国际主义"两种风格。
> - 触发词：网页 PPT、杂志风 PPT、瑞士风 PPT、Swiss Style、horizontal swipe deck
> - 场景：需要制作分享/演讲/发布会风格的网页幻灯片

> **obsidian-astro-blog-maintainer** — Obsidian 博客维护
> - 作用：维护用 Obsidian 风格 Markdown 编写的 Astro 博客——wiki 链接转换、内部链接更新、MD 目录生成。
> - 触发词：博客维护、Astro blog、Obsidian wiki link、markdown 目录
> - 场景：基于 Obsidian 写作的 Astro 博客需要格式兼容转换

> **pdm-daily-report** — PDM 日报
> - 作用：处理 PDM 日报与 Obsidian Vault 工作记录的自动化流程——日报更新、周报生成、索引维护。
> - 触发词：日报更新、周报生成、PDM 日志、Obsidian Vault
> - 场景：需要自动化处理 PDM 日志与日报周报（实习期间使用）

> **handoff** — 会话交接
> - 作用：将当前会话压缩为交接文档，供另一个 Agent 接手继续工作。
> - 触发词：handoff、会话交接、compact conversation
> - 场景：会话过长需换 Agent 或需将上下文转移给另一个工具

---

## product — 产品与策略

> **autoresearch** — 内容优化研究
> - 作用：Karpathy 风格 autoresearch——生成 50+ 变体，5 专家模拟评分，多轮进化，输出最优版本 + 完整实验日志。
> - 触发词：optimize this page、run autoresearch、score these variants、A/B test copy
> - 场景：landing page / email / 广告文案 / CTA 等转化内容优化

> **darwin-skill** — Skill 优化器
> - 作用：用 8 维度评分体系（结构+有效性）自动评估和优化 SKILL.md 文件，类似 Karpathy 的 autoresearch 应用于 Skill。
> - 触发词：darwin skill、skill optimizer、优化 skill
> - 场景：Skill 效果不理想时需要系统化评估和改进

> **grill-me** — 设计评审质问
> - 作用：对用户的计划/设计进行 relentless 追问，直到达成共识并解决决策树每个分支。
> - 触发词：grill me、challenge my plan、评审我的设计
> - 场景：方案评审前需要被尖锐追问以确保周全

> **grill-with-docs** — 文档对齐质问
> - 作用：基于现有领域模型质问方案，明确术语，实时更新 CONTEXT.md 和 ADR。
> - 触发词：grill with docs、align with domain model
> - 场景：方案需与现有架构文档对齐并同步更新决策记录

> **improve-codebase-architecture** — 架构提升
> - 作用：在代码库中寻找深化机会——基于 CONTEXT.md 的领域语言和 docs/adr/ 的决策。
> - 触发词：improve architecture、架构优化、重构
> - 场景：代码库需要系统化架构审视而非局部重构

> **peer-competitor-feature-strategy** — 同级竞品策略
> - 作用：使用同级竞品（而非市场领导者）进行竞品分析和功能建议——数据矩阵→功能映射→不确定项标记。
> - 触发词：竞品分析、对标研究、功能建议、同级竞品、数据矩阵
> - 场景：需要基于同类规模竞品推导可落地的功能策略

> **product-design-analysis** — 设计图功能分析
> - 作用：接收产品设计图→识别 UI 页面→功能清单→联网抓取真实商店数据→功能+竞品分析报告→新增需求。
> - 触发词：功能分析、竞品分析、设计图分析、产品对标
> - 场景：拿到设计稿需要系统化功能提取与竞品对标

> **to-issues** — 拆分为 Issues
> - 作用：将计划/规格/PRD 拆分为可独立接取的 issues，使用 tracer-bullet 垂直切片。
> - 触发词：to issues、break plan into issues、拆成 issue
> - 场景：大方案需要拆分为多个可独立执行的工作项

> **to-prd** — 会话转 PRD
> - 作用：将当前对话上下文转为 PRD 并发布到项目 issue tracker。
> - 触发词：to PRD、convert to PRD、生成 PRD
> - 场景：讨论成熟后直接输出正式 PRD

> **triage** — Issue 分诊
> - 作用：通过分诊角色驱动状态机处理 issues——创建、审查、分类、准备 AFK Agent 任务。
> - 触发词：triage issues、create issue、review bug、issue workflow
> - 场景：issue 管理流程需要结构化分诊

> **ui-grounded-feature-review** — UI 防幻觉审查
> - 作用：在分析 UI 截图/设计稿时检测并防止幻觉产品功能——将无 UI 证据的功能删除、降级或标记为假设。
> - 触发词：UI feature review、功能分析、hallucination detection
> - 场景：从 UI 证据生成功能分析文档，需要确保声明有视觉支撑

> **web-prototype** — 网页克隆原型
> - 作用：将线上网页克隆为本地 Next.js + Tailwind CSS 项目，支持快速原型迭代。
> - 触发词：clone this page、replicate website、web prototype
> - 场景：快速复刻参考页面进行定制开发

> **write-a-skill** — 编写 Skill
> - 作用：创建新 Agent Skill——proper structure、progressive disclosure、bundled resources。
> - 触发词：write a skill、create skill、新建技能
> - 场景：需要封装自定义工作流为可复用 Skill

> **zoom-out** — 全局视角
> - 作用：让 Agent 跳出当前代码细节，提供更广的上下文或更高层次的视角。
> - 触发词：zoom out、全局视角、big picture、broader context
> - 场景：不熟悉某段代码或需要理解其在系统中的位置时

---

## local — 本地工具

> **local-memory-skill** — 本地记忆管理
> - 作用：初始化、读取、验证和维护面向 AI Agent 的本地优先 Markdown/YAML 记忆仓库——持久上下文、用户偏好、项目记忆、约束、任务历史。
> - 触发词：本地记忆、初始化记忆、读取记忆、用户偏好、项目记忆、memory writeback
> - 场景：任何需要持久化 Agent 上下文和用户偏好的工作流

> **diagnose** — 诊断调试
> - 作用：纪律化诊断循环——Reproduce → Minimise → Hypothesise → Instrument → Fix → Regression-test。强硬要求建立反馈循环。
> - 触发词：diagnose this、debug this、性能回归、something is broken
> - 场景：复杂 bug 或性能回归需要系统化而非 ad-hoc 调试

> **hatch-pet** — 动画宠物创作
> - 作用：从角色艺术/生成图片/品牌素材创建、修复、QA 和打包 Codex 兼容的动画宠物及精灵表。
> - 触发词：create pet、animated pet、sprite sheet、hatch pet
> - 场景：需要创建像素动画角色或宠物精灵表

> **setup-matt-pocock-skills** — 工程 Skill 配置
> - 作用：在 AGENTS.md/CLAUDE.md 和 `docs/agents/` 中设置 `## Agent skills` 块，让工程 Skill 知道项目的 issue tracker（GitHub 或本地 markdown）。
> - 触发词：setup agent skills、matt pocock、配置 skill
> - 场景：项目初始化时配置 Agent 工程能力

> **excalidraw-mcp** — Excalidraw 绘图
> - 作用：通过 MCP 协议驱动 Excalidraw 绘图工具，支持脚本化创建/编辑图表。
> - 触发词：draw diagram、excalidraw、流程图、架构图
> - 场景：需要生成或修改 Excalidraw 格式的图表

---

> *最后更新：2026-06-12 | 总计 56 Skills / 9 分类 | 不含 Browser、Documents、Presentations、Spreadsheets 四个内置插件*
