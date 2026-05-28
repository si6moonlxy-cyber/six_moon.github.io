# 完全本地化抽象问题 Memory 文件夹系统研究报告

## 执行摘要

对于一位把 Agent 当作“第二操作系统”来高强度使用的 AI 产品经理/准 CEO，这个 Memory 系统不应只是聊天记录仓库，而应是一个**本地优先、层级化、可审计、可回放、可版本化**的“决策记忆底座”。从工程实现上，最稳妥的思路不是直接把向量数据库当作“真相源”，而是把**文件系统**作为唯一真相源，把 **SQLite FTS5、FAISS/Chroma/Milvus Lite** 当作**可重建索引层**；其中 SQLite FTS5 适合透明的本地全文检索，FAISS 适合高效稠密向量检索，Chroma 适合最小化 Python 本地持久化，Milvus Lite 适合未来平滑升级到更强检索能力与服务形态。

如果没有预算与硬件约束，最推荐的默认栈是：**文件夹源数据 + SQLite manifest/FTS5 + BGE-M3 主 embedding + bge-reranker-v2-m3 二阶段重排 + PyMuPDF 文档解析 + Watchdog 增量监听 + Ollama 或 llama.cpp 本地模型服务**。原因是 BGE-M3 同时支持 dense / sparse / multi-vector，并且官方明确建议在 RAG 中采用“hybrid retrieval + re-ranking”；bge-reranker-v2-m3 则提供多语言、较易部署的本地重排能力。PyMuPDF 适合本地 PDF/表格/Markdown 抽取，Watchdog 可用于跨平台目录监听，Ollama 和 llama.cpp 都能在本地完成模型调用。

如果你要先做一个**低风险、强可解释、最小可行原型**，则应优先做成“**父文件夹摘要索引 + 子文件细粒度索引 + 启动必读脚本**”三层结构：父层负责主题路由与优先级，子层负责检索命中，启动脚本负责每次执行前的强制读取、索引检查、检索与 RAG 装配。这个思路与 LangChain 的 ParentDocumentRetriever“先检索小块再回溯父文档”和 LlamaIndex 的 small-to-big recursive retrieval 思路相吻合，但在你的场景中，父节点不再只是“大文档”，而是一个**Memory 主题文件夹**。

商业化与长期使用时，**许可证与本地安全**是两个首要风险。BGE-M3 与 FlagEmbedding 为 MIT 体系，bge-reranker-v2-m3 为 Apache-2.0，EmbeddingGemma 官方文档明确支持负责的商业使用；但 Jina Embeddings v3 官方页面标注为 CC-BY-NC-4.0 且已被更新模型替代，因此不适合作为商业默认方案。与此同时，PyMuPDF 是 AGPL/commercial 双轨，若你的产品不是开源分发，需要尽早评估替代解析链或商业授权。对完全本地化目标而言，建议把 Memory 根目录放在 **BitLocker / FileVault / LUKS** 这样的整盘加密环境上。

## 需求与目标

你的目标不是做一个“个人知识库”，而是做一个**面向持续执行的 Agent 操作内存系统**。这意味着系统必须同时满足六类要求：

|维度|含义|对你的场景为何重要|建议验收阈值|
|---|---|---|---|
|本地优先|记忆、索引、检索、RAG 全链路可在离线完成|保护敏感项目、战略、约束、个人偏好|断网仍可完成读取、检索、回答|
|层级可解释|Memory 必须按父/子结构组织|你需要审计：Agent 为什么读了哪些记忆|任意回答都能回溯到父节点与子文件|
|稳定记忆|记忆区分“长期事实/限制/项目状态”与“短期噪音”|高频使用下，垃圾记忆会迅速污染上下文|新记忆写入需经过持久性判定|
|低延迟|启动脚本不能成为每次调用的主要瓶颈|高强度使用下，首包延迟决定可用性|父层必读 < 1–3 秒；增量索引小文件 < 5 秒|
|可恢复|索引损坏或模型替换后，可由文件重新构建|长期使用中重装、迁移、升级是常态|删除索引目录后可全量重建|
|强约束优先|Restriction、角色、当前项目优先于普通知识|否则 Agent 容易答对事实、答错立场|启动必读必须强制读取高优先级目录|

从产品目标上看，这个系统更像**“面向抽象问题的本地记忆 OS”**，而不是简单的 RAG demo。抽象问题记忆的核心不是保存原对话，而是把对话抽取成稳定结构，例如：**角色画像、非目标、禁区、当前战略、决策依据、进行中的项目主线、重复出现的偏好、可复用的方法论**。换言之，系统要沉淀的是“可被多轮任务复用的判断材料”，而不是“曾经说过的话”。

因此，Memory 中最重要的对象不应是“消息”，而应是**Memory 单元**。一个 Memory 单元至少要能回答四个问题：这是什么主题、为什么重要、它适用于哪些任务、它的证据和版本是什么。若做不到这一点，记忆就会退化为不可控的文本堆。

## 架构设计

### 总体设计原则

推荐采用“**文件系统真相源 + 双索引层 + 版本日志层**”结构。文件系统负责可读可写与人类审计；元数据与全文索引建议进入 SQLite；向量索引则单独存储在 FAISS、Chroma 或 Milvus Lite 中。这样做的好处是：  
其一，**源数据透明**，你永远可以直接打开文件夹检查真实内容；  
其二，**索引可抛弃**，任何向量库故障都不会导致记忆资产丢失；  
其三，**迁移成本低**，未来可从 SQLite+FAISS 平滑迁到 Chroma 或 Milvus Lite。SQLite FTS5 提供本地全文检索能力；FAISS 提供高效稠密向量搜索；Chroma 支持本地目录持久化与 metadata；Milvus Lite 支持本地 `.db` 文件并与更大规模 Milvus API 兼容。

![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1779977938/six-moon-blog/blog/0e17c5dff4f567c6ed70a4dc33465f22.png)

### 推荐的父文件夹体系

对你的使用方式，父文件夹不宜过多；太散会让启动脚本路由困难。建议先从以下体系开始：
```text
Memory/
  _root.yaml
  User/
    产品经理/
      _parent.yaml
      role_profile.md
      preference_priorities.md
      working_style.md
  Project/
    Alpha/
      _parent.yaml
      project_brief.md
      roadmap.md
      open_questions.md
      decisions/
      meetings/
  Restriction/
    _parent.yaml
    non_goals.md
    compliance.md
    privacy_local_only.md
  Decision/
    _parent.yaml
    pricing_strategy.md
    hiring_principles.md
  Inbox/
    _parent.yaml
    pending_capture/
  Archive/
    _parent.yaml
```

这个结构的要点，是让父文件夹本身就能表达**语义边界**。例如：  
`Memory/User/产品经理` 负责“你是谁、你偏好什么、你如何工作”；  
`Memory/Restriction` 负责“不能做什么、必须遵守什么”；  
`Memory/Project/Alpha` 负责“当前项目 Alpha 的上下文”；  
`Memory/Decision` 负责“已经形成并可长期复用的判断”。  
这样，Agent 在启动时无需扫全库，只需先读高优先级父层摘要，再决定是否深入子文件。

### 元数据模型

建议每个父文件夹有一个 `_parent.yaml`，每个子 Memory 用“正文文件 + sidecar 元数据文件”或“带 front matter 的 Markdown 文件”表达。下面是一套足够严谨、又不至于过重的字段模型：

|字段|层级|类型|说明|
|---|---|---|---|
|`memory_id`|子|string|全局唯一 ID，例如 `proj.alpha.decision.0007`|
|`parent_id`|父/子|string|父文件夹标识，例如 `Project/Alpha`|
|`kind`|子|enum|`fact / preference / restriction / decision / task_state / method / note`|
|`title`|子|string|标题|
|`abstract`|子|string|1–3 句摘要，供父层索引|
|`tags`|子|string[]|主题标签|
|`entities`|子|string[]|涉及的人、项目、产品、指标|
|`priority`|子|enum|`critical / high / normal / low`|
|`sensitivity`|子|enum|`public / private / secret`|
|`status`|子|enum|`active / tentative / deprecated / archived`|
|`valid_from` / `valid_to`|子|datetime|时效边界|
|`source_refs`|子|string[]|证据引用，可指向文件、会议摘要、外部材料|
|`version`|子|int|当前版本号|
|`base_version`|子|int|本次修改所基于的版本|
|`content_hash`|子|string|正文 SHA-256|
|`index_generation`|子|int|对应向量索引世代号|
|`links`|子|string[]|与其他 memory 的双向关联|
|`owner`|父/子|string|默认所有者，可用于权限判断|

父层元数据则更偏“主题路由”：`folder_summary`、`must_read`、`active_children`、`routing_keywords`、`priority_bias`、`last_refresh`。  
这样做的意义是：父层先做**粗召回**和**优先级控制**，子层再做**细检索**和**证据返回**。

### 父子索引策略

这里最关键的不是“把父文件夹做成目录树”，而是把它做成**两级检索结构**。

推荐策略如下：

|层级|存什么|为什么|检索时怎么用|
|---|---|---|---|
|父层索引|父摘要、活跃子列表、主题标签、路由关键词、优先级偏置|让 Agent 先知道“该去哪一类记忆里找”|先做 top-N 父层召回|
|子层索引|细粒度子文件、chunk、span、证据定位|保证命中具体记忆与证据|只在已选父层内做精检索|
|版本层|版本日志、冲突文件、废弃记录、变更指纹|保证可恢复、可审计、可回滚|回答时默认读最新版，必要时向上追溯|

这与 ParentDocumentRetriever 的思路一致：它把原文拆成更小的 child chunk 来存储和检索，但检索命中后返回更大的父文档；LlamaIndex small-to-big retrieval 也是先从小块找到信号，再逐层回到更大上下文。你的系统只需要把“父文档”抽象成“父文件夹/主题 Memory”。

在你的场景里，我建议把“父层 index”做成三种信号的融合：  
**摘要向量**、**路由关键词/BM25**、**显式优先级偏置**。  
其中优先级偏置很重要，因为 `Restriction`、`User`、`当前项目` 不应该与历史归档同权竞争。

### 版本与冲突处理

对于长期使用 Agent 的人，最大的隐患不是“读不到”，而是“写乱了”。因此建议采用**乐观并发 + 版本快照 + 冲突显式化**：

当 Agent 准备写入一个已有 SubMemory 时，它必须携带 `base_version`。若当前最新版本与 `base_version` 不一致，则说明有人类或其他 Agent 已经修改过，应进入冲突处理。Git 的合并哲学非常适合作为参考：Git 会在可明确合并时自动处理，但遇到冲突不会自作聪明，而是显式暴露冲突，要求人工或规则来解决。

在 Memory 系统里，建议分三种冲突：

|冲突类型|自动处理方式|人工介入条件|
|---|---|---|
|元数据不相交|自动合并|无|
|正文同段落轻微追加|规则合并并生成新版本|低|
|同一事实相互矛盾|生成 `conflict` 子文件并阻止自动覆盖|高|

最实用的落地方式不是一开始就上复杂 CRDT，而是：  
**正文文件不可直接覆盖；每次写入都先生成版本快照；索引只指向最新 active 版本；冲突版本被显式挂到父层索引中等待确认。**  
对单人高频使用场景，这已经足够稳。

### 权限与本地安全

完全本地化并不自动等于安全。真正可用的本地安全至少应有四层：

表层是**整盘/整卷加密**。Windows 侧可依赖 BitLocker，macOS 侧可依赖 FileVault，Linux/Ubuntu 常见做法是 LUKS；这些方案都以“设备丢失或被物理接触时仍保护静态数据”为目标。

第二层是**进程与文件权限**。建议为 Agent 运行一个专门本地用户或受限运行环境，Memory 根目录默认不给其他普通进程写权限；如果你将来把检索服务做成长期驻留进程，默认只绑定 `127.0.0.1`。

第三层是**服务级鉴权**。如果未来从单机脚本升级到本地 Milvus 服务，Milvus 文档明确提供用户认证、TLS 和 RBAC 能力；这对单用户原型不是刚需，但对团队共享机器或局域网暴露服务会很重要。

第四层是**本地解析链不上云**。PyMuPDF 官方明确写明它在本机进程内运行，调用 `open()`、`get_text()`、`find_tables()` 等方法时不会把数据发到外部；这非常适合做本地文档摄取底座。

## 本地检索与索引实现

### 检索策略建议

对于“抽象问题”Memory，单一向量检索通常不够。原因在于：  
抽象问题经常依赖**业务术语、项目代号、边界条件、否定约束、具体 KPI 名词**；这些内容有时更适合被 BM25/全文检索捕捉，而不是被纯语义向量完全吸收。SQLite FTS5 原生支持本地全文检索；Milvus 官方文档也明确强调全文检索/BM25 对精确关键词匹配的价值，并建议与稠密向量检索组合成 hybrid search。BGE-M3 官方模型卡同样明确建议在 RAG 中使用“hybrid retrieval + re-ranking”。

因此，最推荐的本地检索链路是：

**父层路由**：标题/摘要的 sparse + dense 检索  
→ **子层召回**：在候选父层内部做 dense + sparse 检索  
→ **metadata 过滤**：按 `status / priority / parent_id / sensitivity / active_project` 过滤  
→ **二阶段 rerank**：对 top-k 候选进行 cross-encoder 重排  
→ **父文档重建**：把 chunk 恢复回子 Memory，再按父层组织输出给 Agent

Chroma 与 Milvus 都支持 metadata 过滤；SentenceTransformers 文档则把 embedding、reranker、sparse encoder 放在同一技术栈下，便于统一实现。

### 本地 embedding 模型选择

下表优先列出**更适合本地、开源、或官方明确支持本地/商用**的选择。资源栏优先采用官方参数量、上下文和官方打包体积；后续部署内存仍会受 batch size、dtype、推理框架影响。

|模型|语言与上下文|许可|资源信号|适合场景|不足|主要来源|
|---|---|---|---|---|---|---|
|**BAAI/bge-m3**|100+ 语言，8192 tokens，1024 维；支持 dense / sparse / multi-vector|MIT|Ollama 打包约 1.2GB，约 567M 级别|中文/英文混合、长文档、想做 hybrid retrieval 的默认首选|比轻量模型更吃资源||
|**BAAI/bge-small-zh-v1.5**|中文，512 维，24M params|MIT；页面明确可免费商用|极轻量，CPU 友好|中文为主、低配机器、先做 MVP|不擅长多语言；上下文短||
|**EmbeddingGemma**|多语言，2K tokens，可从 768 缩到 128 维；训练覆盖 100+ 语言|官方写明可负责地商业使用|308M params；量化后可低于 200MB RAM；Ollama 包约 622MB|手机上的 on-device 检索、低内存、本地安全优先|2K 上下文短于 BGE-M3；不是 hybrid 一体化模型||
|**mixedbread-ai/mxbai-embed-large-v1**|英文强项；支持 MRL/量化|Apache-2.0|0.3B params|英文文档占主导、想压缩 embedding 存储成本|中文不是主战场||
|**jina-embeddings-v3**|1024 维，8K，上百种支持语言，Matryoshka|CC-BY-NC-4.0；官方页标注已被新模型替代|570M params|研究、评估、非商业实验|不适合作为商业默认；已不是 Jina 官方当前主推||

如果你要一个**商业可用默认组合**，建议直接分成两档：

- **低配档**：`bge-small-zh-v1.5`（中文）或 `EmbeddingGemma`（低资源多语言）
- **平衡/默认档**：`BGE-M3 + bge-reranker-v2-m3`

之所以推荐 `bge-reranker-v2-m3` 作为重排器，是因为其模型卡明确把它定义为多语言、易部署、快速推理的 lightweight reranker，适合做 top-k 二阶段重排；其 Apache-2.0 许可也比非商用许可证稳妥。

### 向量数据库与替代方案比较

|方案|本地持久化方式|元数据/过滤|全文/稀疏能力|运维复杂度|更适合什么|备注|
|---|---|---|---|---|---|---|
|**FAISS + SQLite**|FAISS 索引文件 + SQLite 文件|需外部元数据表|通过 SQLite FTS5 补齐|低|单用户、追求高性能与可控性|FAISS 是高效稠密向量库，本身不提供完整文档数据库体验|
|**Chroma PersistentClient**|本地目录|原生 metadata、collections|以向量为主；可结合 where / where_document|很低|Python 本地 MVP、快速迭代|最省心的本地向量存储之一|
|**Milvus Lite**|本地 `.db` 文件|强；未来可升到服务版|Milvus 平台支持 hybrid / BM25 / 全文|中|预计会扩到更大规模，或以后想迁到服务化|本地开发与未来放大之间的迁移路径最好|
|**SQLite FTS5 + sqlite-vec**|单文件 SQLite|可自定义|FTS5 很强；sqlite-vec 可补向量|低到中|极致透明、易备份、可审计|sqlite-vec 目前仍是 pre-v1，需接受 breaking changes 风险|
|**DuckDB + VSS**|DuckDB 文件|强分析能力|向量扩展存在，但官方标注 experimental|中|你想把检索与分析/统计放在同一引擎|适合分析型工作流，不建议一上来做默认生产底座|
|**Qdrant Local Mode**|本地进程内 / 本地服务|payload filter 强|以向量为主|中|想要类服务化体验，但又不想先起远端集群|官方也建议 Python 开发者试本地模式|

对你的场景，我的明确建议是：

- **最小原型**：`SQLite FTS5 + FAISS` 或 `Chroma`
- **推荐默认**：小规模单机先 `Chroma`；若你明确想走 hybrid/full-text 路线并预留未来扩展，则直接 `Milvus Lite`
- **长期扩展**：保持文件系统为真相源，底层索引可从 Chroma/FAISS 升到 Milvus 或 Qdrant，而不改 Memory 目录结构

### 索引更新、增量索引与实时性

增量索引策略不应建立在“每次全量重算”上，而应建立在“**内容哈希 + 文件事件 + 世代号**”三件事上。

`Watchdog` 提供跨平台目录监听，可在文件变化时触发增量处理；SQLite 负责保存 `content_hash`、`mtime`、`index_generation`；向量层只重算发生变化的子文件 chunk。

建议把实时性拆成三层：

|层次|更新内容|时机|目标|
|---|---|---|---|
|即时层|子文件文本、chunk、向量|文件落盘后 1–3 秒内|保证“刚写入就能搜到”|
|延迟层|父摘要、活跃标签、路由词|变更后 debounce 5–30 秒|防止频繁重写父索引|
|批处理层|全库重建、去重、归档、压缩|每日或每周|控制长期漂移|

具体策略应遵循几条规则：

其一，**索引对象只接受规范化文本**。PDF、Markdown、JSON、会议纪要都先转成统一文本表示，再切块。PyMuPDF 非常适合 PDF 主线场景，能抽文本、表格、Markdown，且全部本地执行；若你需要更广的文档格式覆盖，Apache Tika 是良好的补充。

其二，**chunk 层与记忆单元层分开**。向量索引保存 chunk，但返回结果要能回溯到 `memory_id`。否则你会得到“命中了一段文本”，但不知道该把哪份 SubMemory 放进上下文。

其三，**同一 embedding 模型必须同时用于建库与查询**。Ollama 的 embedding 文档明确建议索引和查询使用同一 embedding 模型；否则会出现 embedding drift，召回质量会不可控。

其四，**删除必须是软删除 + tombstone**。这样版本层和索引层都能保持一致，避免“文件删了但向量还在”。

## Agent 必读脚本设计

### 启动流程

“必读脚本”不是一个普通预处理器，而是整个系统的**治理入口**。它必须在每次 Agent 执行前做四件事：

先确认要不要刷新索引，再加载强制优先级 Memory，再根据当前任务做父层路由，最后在候选父层内执行子层检索与 RAG 装配。这个顺序不能反过来；否则 Restriction 或 User 层很可能在召回阶段就被淹没。

建议默认优先级如下：

|优先级|目录|读取方式|
|---|---|---|
|最高|`Memory/Restriction`|启动必读，始终装入|
|高|`Memory/User/产品经理`|启动必读，始终装入|
|高|`Memory/Project/<active>`|由当前任务或会话上下文触发|
|中|`Memory/Decision`|若任务涉及策略/历史决策则装入|
|中|`Memory/Inbox`|只参与写入和待分类，不应污染默认上下文|
|低|`Memory/Archive`|仅在低置信度回退时参与|

BGE-M3 官方建议 hybrid retrieval + reranking；SentenceTransformers 文档也明确把 embedding、reranker、sparse encoder 作为统一检索栈的一部分，这很适合把“必读脚本”做成一条稳定的多阶段流水线。

```
flowchart TD
    A[Agent 启动] --> B[读取 _root.yaml 与配置]
    B --> C{有文件变更吗}
    C -- 有 --> D[增量索引更新]
    C -- 无 --> E[加载强制必读 Memory]
    D --> E
    E --> F[根据任务生成 folder priors]
    F --> G[父层 hybrid 检索]
    G --> H[子层 dense+sparse 检索]
    H --> I[metadata 过滤]
    I --> J[rerank top-k]
    J --> K[装配 Memory Context]
    K --> L[执行 Agent 主任务]
    L --> M[评估是否写入/更新 SubMemory]
    M --> N{稳定且新颖吗}
    N -- 是 --> O[创建或更新 SubMemory]
    N -- 否 --> P[仅写入会话临时缓存]
```

### 检索与 RAG 流程

建议把检索分成三步，而不是一次性 top-k：

**先路由，再精检，再压缩。**

先路由，是为了让父层摘要决定“这次任务更像哪个主题簇”；  
再精检，是为了避免在全库上做细粒度向量搜索；  
再压缩，是为了让最终交给 Agent 的上下文是“少而准”的记忆包，而不是原始命中列表。

一个比较实用的上下文组装策略是：

- 始终包含 `Restriction` 与 `User` 的精简摘要
- 加入 `top 2–3` 个父层主题
- 每个父层保留 `top 2–4` 个子 Memory
- 每个子 Memory 保留最相关的 `1–3` 段 span
- 若命中来自同一个 `memory_id` 的多个 chunk，则返回该 child 的合并摘要，而不是简单拼接所有 chunk

这本质上是在把 ParentDocumentRetriever 的“由 child 回到 parent”做成更适合 Agent 的**Memory 包装器**。

### 何时创建新 SubMemory

最容易把系统做坏的，不是“不会写记忆”，而是“乱写记忆”。我建议把创建新 SubMemory 的逻辑从“每次有新信息就写”改成“满足持久性与新颖性门槛才写”。

一个可操作的判定框架如下：

|维度|判断问题|建议阈值|
|---|---|---|
|持久性|这条信息未来 7–30 天还可能被复用吗？|高于临时噪音|
|新颖性|与现有 Memory 的相似度是否足够低？|去重相似度阈值可设 0.82–0.90|
|可证据化|是否能给出来源、上下文、发生时间？|没证据不入正式 Memory|
|行动相关性|这会改变后续 Agent 的计划、边界或偏好判断吗？|若不会，进 Inbox|
|归属性|能明确归到某个父文件夹吗？|归不进去先放 `Inbox`|

最推荐的写入分类是三段式：

- **直接写正式 SubMemory**：长期有效、影响策略或限制
- **写 `Inbox/pending_capture`**：有价值，但归类/稳定性不够
- **不写**：纯一次性上下文、无复用价值

### 示例伪代码

下面是一份足够能落地的伪代码骨架：
```python
def must_read_bootstrap(task: str, query: str):
    config = load_yaml("Memory/_root.yaml")
    changed_files = detect_changes_by_hash_and_mtime()
    if changed_files:
        incremental_reindex(changed_files)

    mandatory = []
    mandatory += load_parent_summary("Memory/Restriction")
    mandatory += load_parent_summary("Memory/User/产品经理")

    active_projects = infer_active_projects(task, query)
    folder_priors = {
        "Restriction": 3.0,
        "User/产品经理": 2.5,
        **{f"Project/{p}": 2.0 for p in active_projects},
        "Decision": 1.3,
        "Archive": 0.4,
    }

    parent_hits = hybrid_search_parents(
        query=query,
        priors=folder_priors,
        top_k=5
    )

    candidate_children = []
    for parent in parent_hits:
        candidate_children.extend(
            hybrid_search_children(
                parent_id=parent.parent_id,
                query=query,
                metadata_filters={"status": "active"}
            )
        )

    reranked = rerank(query, candidate_children, top_k=12)
    context = assemble_context(
        mandatory=mandatory,
        evidence_hits=reranked,
        token_budget=2500
    )
    return context


def should_create_submemory(observation, existing_hits):
    persistence_score = score_persistence(observation)
    novelty_score = 1.0 - max_similarity(observation, existing_hits)
    evidence_score = score_evidence(observation)
    policy_impact = score_policy_or_strategy_impact(observation)

    if persistence_score >= 0.7 and novelty_score >= 0.6 \
       and evidence_score >= 0.6 and policy_impact >= 0.5:
        return "formal"
    if persistence_score >= 0.4:
        return "inbox"
    return "drop"
```

## 工具与部署建议

### 开源组件与依赖清单

下面这套清单能覆盖你要的本地 Memory 文件夹系统主链路：

|层|推荐组件|用途|关键注意点|主要来源|
|---|---|---|---|---|
|文档解析|**PyMuPDF**|PDF 文本、表格、Markdown 抽取|AGPL / 商业授权需评估；本地执行不上云||
|多格式回退|**Apache Tika**|更广格式的文本与元数据抽取|Java 依赖更重，但格式覆盖更广||
|文件监听|**Watchdog**|目录变更触发增量索引|对同步盘与网络盘建议加 debounce||
|Embedding 框架|**SentenceTransformers**|统一 embedding / reranker / sparse encoder|最通用、生态最好||
|BGE 生态|**FlagEmbedding**|BGE/BGE-M3/BGE reranker 官方工具链|BGE 系列最顺手||
|全文检索|**SQLite FTS5**|本地关键词/BM25 风格检索|极透明、易调试||
|稠密检索|**FAISS**|高性能向量相似度检索|metadata 需外接||
|一体化本地向量存储|**Chroma**|本地目录持久化、metadata、collection|最适合快速 MVP||
|可扩容向量数据库|**Milvus Lite**|本地 `.db` 文件，与更大 Milvus API 衔接|适合未来扩容到服务版||
|本地模型服务|**Ollama**|本地 embeddings / chat API|最省安装心智负担||
|轻量推理引擎|**llama.cpp**|GGUF、量化、本地 OpenAI-compatible server|最适合可控、轻量、低层部署||
|GPU 服务化可选|**vLLM**|独立 GPU 推理服务|更偏服务端，不是最小原型首选||
|版本与回滚|**Git**|分支、快照、冲突可视化|不建议直接把索引二进制纳入主仓库||

### 本地模型运行时比较

|运行时|最适合谁|优点|缺点|主要来源|
|---|---|---|---|---|
|**Ollama**|想最快跑通本地原型的人|安装简单；内置 embedding/chat API；跨 macOS/Windows/Linux|抽象层较高，控制粒度略弱||
|**llama.cpp**|想要最细控制与最小依赖的人|本地 GGUF、量化成熟、OpenAI-compatible server、硬件覆盖广|需要自己处理更多打包与模型管理||
|**vLLM**|有独立 GPU 机器并追求服务吞吐的人|适合离线批量与 GPU 服务化|对最小本地原型来说偏重||

### 硬件档位建议

以下是**在“无特定硬件/预算限制”前提下**的实用建议。表内资源属于工程估算，依据官方参数量、上下文长度、模型打包体积与常见部署方式推断，不是厂商基准。

|档位|推荐 embedding|推荐索引栈|推荐推理运行时|建议硬件|适合的数据规模|结论|
|---|---|---|---|---|---|---|
|轻量档|`bge-small-zh-v1.5` 或 `EmbeddingGemma`|SQLite FTS5 + FAISS|Ollama 或 llama.cpp|16GB RAM，CPU-only；若有 8GB VRAM 更好|几千到十几万 chunks|最适合先做可用 MVP|
|平衡档|`BGE-M3` + `bge-reranker-v2-m3`|Chroma 或 Milvus Lite + FTS5|Ollama|32–64GB RAM，8–16GB VRAM|十万到数十万 chunks|**默认推荐档**|
|工作站档|`BGE-M3` + 重排 + 本地 LLM 服务|Milvus / Qdrant local / Chroma server|llama.cpp 或 vLLM|64GB+ RAM，24GB+ VRAM|数十万到百万级 chunks|适合长期重度与多项目并行|

如果让我只给一句落地建议：  
**先用“平衡档”的结构设计，但用“轻量档”的工具把 MVP 跑起来。**  
也就是：先按长期结构把目录、元数据、版本、启动脚本设计好；真正上线第一版时，先用 SQLite/FAISS/Chroma 与小模型验证流程，而不是一开始就把数据库和模型都堆到最重。

### 安装与配置要点

最小 Python 原型可从以下依赖开始：
```bash
pip install -U sentence-transformers faiss-cpu watchdog pymupdf pyyaml rapidfuzz
```

如果要走 Chroma：
```bash
pip install -U chromadb
```

如果要走 Milvus Lite：
```bash
pip install -U "pymilvus[milvus-lite]"
```

如果要本地模型服务：
```bash
# 安装 Ollama 后再拉模型
ollama pull bge-m3
# 或根据低配方案选择其他 embedding 模型
```

这些依赖与安装入口都来自官方文档或官方仓库页面。

## 最小可行原型与验证

### 推荐的端到端 MVP 路线

我建议你把第一版 MVP 严格限制在“**本地文件系统 + SQLite FTS5 + FAISS + 一个 embedding 模型 + 一个必读脚本**”上。原因很简单：你现在最需要验证的是**记忆架构是否有效**，而不是数据库选型是否最前沿。

第一步，建立文件系统与元数据约定。  
目录结构固定后，再写 `_root.yaml` 和每个父文件夹的 `_parent.yaml`。其中 `_root.yaml` 负责声明：必读目录、默认模型、索引路径、是否启用重排、写入策略阈值。

第二步，做解析与规范化。  
对 Markdown、TXT、JSON 直接读取；对 PDF 用 PyMuPDF 抽文本与表格；如遇扫描 PDF，再按需加 OCR。PyMuPDF 官方还提供面向 LLM/RAG 的 Markdown 输出路径，这非常适合把解析结果统一成一类文本资产。

第三步，做一个极简 SQLite schema。建议至少有以下表：
```sql
CREATE TABLE memories (
  memory_id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL,
  title TEXT,
  abstract TEXT,
  kind TEXT,
  priority TEXT,
  status TEXT,
  sensitivity TEXT,
  version INTEGER,
  content_hash TEXT,
  path TEXT,
  updated_at TEXT
);

CREATE VIRTUAL TABLE memory_fts
USING fts5(memory_id, parent_id, title, abstract, body);

CREATE TABLE chunks (
  chunk_id TEXT PRIMARY KEY,
  memory_id TEXT NOT NULL,
  chunk_order INTEGER,
  start_offset INTEGER,
  end_offset INTEGER,
  text TEXT,
  vector_id INTEGER,
  FOREIGN KEY(memory_id) REFERENCES memories(memory_id)
);

CREATE TABLE versions (
  version_id TEXT PRIMARY KEY,
  memory_id TEXT,
  base_version INTEGER,
  new_version INTEGER,
  author TEXT,
  created_at TEXT,
  diff_summary TEXT
);
```

第四步，建立初始 FAISS 索引与父层摘要索引。  
子层 chunk 进入 FAISS；父层则为每个父文件夹只生成少量 summary vectors。这样启动脚本先搜父层，再搜子层，首包会明显更稳。

第五步，实现启动必读脚本。  
脚本的输入是当前任务与查询；输出是一个已经压缩好的 Memory context bundle。这个 bundle 包含：`restriction summary`、`user profile summary`、`top parent summaries`、`top child evidence spans`。

第六步，再实现写回策略，而不是一开始就自动写。  
MVP 阶段最好先做“**推荐写入**”而非“自动写入”。也就是 Agent 输出“建议新增 SubMemory / 建议更新哪个 SubMemory”，由你先审核一段时间，观察误写率。

### 示例文件结构

下面是一套可以直接照着搭的最小目录：
```text
workspace/
  Memory/
    _root.yaml
    User/
      产品经理/
        _parent.yaml
        role_profile.md
        working_style.md
    Restriction/
      _parent.yaml
      local_only.md
      non_goals.md
    Project/
      Alpha/
        _parent.yaml
        project_brief.md
        roadmap.md
        open_questions.md
    Decision/
      _parent.yaml
      pricing_strategy.md
    Inbox/
      _parent.yaml
      pending_capture/
    Archive/
      _parent.yaml
  .index/
    manifest.db
    vectors.faiss
    vector_meta.json
    parent_vectors.faiss
  scripts/
    bootstrap.py
    ingest.py
    reindex.py
    writeback.py
```

### 示例 Memory 文件
```yaml
---
memory_id: proj.alpha.decision.0007
parent_id: Project/Alpha
kind: decision
title: Alpha 公测范围与禁区
abstract: 公测阶段重点验证自助上手与留存，不做企业级定制与复杂权限。
tags: [alpha, beta, onboarding, scope]
entities: [Alpha, self-serve onboarding]
priority: high
sensitivity: private
status: active
version: 4
base_version: 3
valid_from: 2026-05-28
source_refs:
  - meeting:weekly-product-2026-05-27
  - file:Memory/Decision/pricing_strategy.md
links:
  - restriction.non_goals.enterprise_customization
content_hash: sha256:...
index_generation: 27
---
公测阶段只验证……
```

### 示例测试用例与验证方法

一个好用的 Memory 系统，不是“能搜到就行”，而是要验证**优先级、时效、稳定写入、冲突、恢复能力**。

|测试项|操作|期望结果|通过标准|
|---|---|---|---|
|约束优先|询问一个与项目策略相关的问题|`Restriction` 与 `User` 总先进入 context|回答可明确引用限制条件|
|父层路由|查询 “Alpha 当前阶段最不该做什么”|应优先命中 `Project/Alpha` 与 `Restriction`|父层 top hit 正确|
|子层证据|查询 “定价为什么不先做企业版”|应返回对应 `Decision` 子文件 span|top-3 里含正确 memory_id|
|增量更新|修改 `roadmap.md` 后立即查询|结果应反映新版本内容|小文件 P95 数秒内可见|
|冲突处理|两个写入同时更新同一 Memory|生成冲突版本或阻止覆盖|不出现静默丢内容|
|恢复能力|删除 `.index/` 全部索引|系统应可从 Memory 重建|全量重建后回答一致性基本保持|
|离线能力|网络断开后执行检索与回答|全链路继续工作|无外部 API 依赖报错|

我建议你至少记录五个长期指标：  
**父层命中率、最终证据命中率、索引新鲜度、误写率、启动 P95 延迟**。  
这些指标会比单次 demo 更决定系统是不是能成为你的长期工作底座。

## 风险限制与替代方案

首先是**许可证风险**。这是本报告里最容易被忽视、但对产品经理/准 CEO 最重要的问题。Jina Embeddings v3 官方页面是 CC-BY-NC-4.0，且页面明确提示它已被更新模型替代；因此它更适合研究，不适合作为商业默认。PyMuPDF 则是 AGPL/commercial 双轨；如果你的成品是闭源产品，要么尽早处理商业授权，要么把 PDF 解析切到许可更合适的链路。相对而言，BGE/FlagEmbedding 的 MIT、bge-reranker-v2-m3 的 Apache-2.0、EmbeddingGemma 的官方商业使用说明，都更适合作为产品默认选型。

其次是**索引一致性风险**。FAISS 很强，但它本质是高效向量搜索库，不是完整文档数据库；如果你把 metadata、版本、删除状态都塞进外部逻辑，就必须建立清晰的 `manifest -> chunks -> vector_id` 映射。FAISS 文档也强调其核心是对向量集合构建索引并执行相似性搜索；这意味着它非常适合做“索引层”，但不应单独承担“记忆真相源”的职责。

第三是**规模与内存风险**。FAISS 官方支持非常大的向量集，甚至可以处理不完全能放入 RAM 的情况，但一旦走到 on-disk / shard / distributed 路径，访问会有明显性能代价。对于你这种以“高价值、强结构化记忆”为主的场景，真正的解法通常不是无限扩库，而是更严格的记忆治理：归档、去重、父层摘要刷新、写入阈值控制。

第四是**解析与 OCR 限制**。本地解析能保护隐私，但也会遇到扫描 PDF、版面复杂表格、截图文本等问题。PyMuPDF 官方支持 OCR 需额外安装 Tesseract；这意味着你要把“文档解析成功率”看成独立工程问题，而不是默认前提。

第五是**本地安全只是减少外部暴露，不等于免疫本地威胁**。整盘加密可以防设备丢失，但无法自动防止本机恶意进程、误删、错误同步、脚本误写。对长期资产，建议至少具备：  
**加密存储、只读备份、快照/版本、索引可重建、写入审计日志**。

最后给出三种替代路线，便于你按精力与硬件选择：

|路线|组成|优点|缺点|适合阶段|
|---|---|---|---|---|
|**极简路线**|文件系统 + SQLite FTS5|最透明、维护最轻|语义检索弱|先验证目录结构与写入策略|
|**推荐路线**|文件系统 + SQLite FTS5 + FAISS/Chroma + BGE|准确率、透明度、复杂度平衡最好|需要自己治理版本与索引|你的默认主线|
|**扩展路线**|文件系统 + Milvus/Qdrant local + hybrid + reranker|更强检索能力与未来扩展|服务化复杂度更高|数据规模与项目数明显上升后|

综合来看，如果今天就要开始落地，我给出的最稳妥结论是：

**把文件夹与元数据模型先设计成“长期不会推倒重来”的样子；把索引层先做轻；把启动必读脚本做强；把写回策略做谨慎。**  
你真正的竞争力，不在于用了哪一个向量库，而在于你把 Agent 的长期工作记忆组织成了一个**本地可审计、父子分层、可检索、可回放的操作系统**。