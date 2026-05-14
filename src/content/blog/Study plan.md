---
title: 学习计划
description: AI 产品经理方向的阶段学习计划
pubDate: 2026-05-12
draft: false
tags:
  - 想法
---
### 1. 先补「AI 产品技术基础」：2 周

目标：面试时能讲清楚 AI 产品怎么从用户问题变成技术方案。

必须学：

- LLM 基础：Token、上下文窗口、幻觉、温度、系统提示、few-shot、函数调用
- Prompt Engineering：角色设定、结构化输出、约束、反例、评测样例
- AI Agent 基础：工具调用、记忆、任务拆解、工作流、失败兜底
- RAG 基础：文档切片、Embedding、向量库、召回、重排、引用来源

为什么先学这个：你简历里已经写了 AI Agent 辅助 PRD、AI Chat 竞品、文档处理、联网搜索、Suggested Prompts、深度专家场景，这些都需要你能解释背后的技术逻辑。 OpenAI 官方也把 function calling 定义为让模型连接外部工具和系统，用于取数据、执行动作和构建工作流；Structured Outputs 用 JSON Schema 约束模型输出，更适合产品经理理解“AI 能不能稳定交付结构化结果”。

产出物：  
做一份《RealBot AI Chat 技术方案拆解》：包括 Prompt、RAG、联网搜索、文件解析、工具调用、订阅转化点、异常兜底。

---

### 2. 再学「数据分析 + 增长变现」：3 周

目标：你要从“会写 PRD”升级成“知道功能怎么影响留存、转化和收入”。

必须学：

- SQL：SELECT、JOIN、GROUP BY、窗口函数
- 产品指标：DAU、WAU、留存、转化率、漏斗、ARPU、ARPPU、LTV
- IAA 指标：展示率、填充率、eCPM、ARPDAU、广告展示节点、广告频控
- 工具：Excel / Google Sheets、SQL、Looker Studio 或 Metabase 基础
- 埋点设计：事件名、属性、触发时机、漏斗路径

为什么第二步学：你的简历明确写了海外 App IAA 变现、AdMob、eCPM、LTV、广告展示节点。如果你只会写广告节点，不会算收入和留存，竞争力会断层。 Google AdMob 官方把 LTV 定义为用户安装后累计产生的收入，包括广告、内购和订阅收入；这正好对应你 AI Chat + IAA/订阅策略的方向。

产出物：  
做一张《AI Chat IAA 变现指标看板设计》：  
首页进入率 → 首次对话率 → 广告展示率 → 广告点击率 → 订阅页曝光 → 订阅转化 → D1/D7 留存 → LTV。

---

### 3. 第三学「API + 后端接口理解」：3 周

目标：不用成为后端，但要能和研发沟通接口、数据结构、异常状态。

必须学：

- HTTP：GET / POST / PUT / DELETE
- JSON：请求参数、返回字段、错误码
- REST API：接口文档怎么看、怎么写
- Postman / Apifox：接口测试
- 基础后端概念：鉴权、限流、异步任务、日志、超时、重试
- 数据库基础：用户表、会话表、消息表、订阅表、广告事件表

为什么第三步学：你已经有软件工程背景和测试验收经历，学 API 会很快；这会让你的 PRD 从“页面描述”变成“研发可落地需求”。你的简历里有 Scan 异常、隐私政策跳转、基础功能测试和发版资料补全，这类问题都需要接口和状态机意识。

产出物：  
写一份《AI Chat 文件上传功能 PRD》：  
上传文件 → 解析 → 切片 → 向量化 → 检索 → 回答 → 引用来源 → 失败提示 → 会员限制。

---

### 4. 第四学「AI 原型开发」：4 周

目标：你不需要做完整工程，但要能做 Demo，让面试官相信你能把想法变成可体验产品。

建议技术栈：

- 前端：React 或 Vue，二选一；优先 React
- UI：Tailwind CSS
- 原型工具：Figma / 蓝湖 / Axure，保留你现在已有优势
- 低代码演示：Cursor + React + OpenAI API / Gemini API
- AI 应用框架：LangChain 基础即可，不要深挖
- 矢量库：Chroma / Supabase Vector / Pinecone，简介原看可以

为什么第四步学：你的简历已有 TechKids Demo、PRD、页面结构和迭代计划；下一步应该补“可交互 Demo”。LangChain 官方文档把 RAG 解释为通过检索外部知识弥补 LLM 上下文有限、训练知识静态的问题，这正好适合你简历中的文档处理、联网搜索、AI 教育和 AI Chat 场景。

产出物：  
做一个小 Demo：  
《TechKids AI Lab》或《RealBot 文档问答助手》  
包含：登录页、聊天页、上传文件、Suggested Prompts、回答引用、订阅弹窗、广告位模拟。

---

## 你的技术栈优先级

|优先级|技术栈|学到什么程度|
|---|---|---|
|P0|LLM / 提示 / 代理 / RAG|能画流程图、写 PRD、讲清楚限制和兜底|
|P0|SQL + 产品指标|能自己查留存、转化、LTV、广告收入|
|P0|API/JSON/Postman|能读接口文档、测接口、定义错误码|
|P1|React + Tailwind|能做简单 AI Demo，不追求工程质量|
|P1|埋点与数据看板|能设计事件、漏斗、指标看板|
|P1|AdMob / IAA / 订阅转化|能讲商业化策略和广告节点|
|P2|Python|会调 API、处理 CSV、做简单脚本即可|
|不建议优先|深度学习训练、PyTorch、CUDA、论文复现|对 AI 产品经理求职性价比低|

## 12 周学习顺序

第 1-2 周：LLM + Prompt + Agent  
产出：《AI Chat 功能技术拆解图》

第 3-5 周：SQL + 数据分析 + IAA 指标  
产出：《RealBot 留存/变现指标体系》

第 6-8 周：API + Postman + 数据库表结构  
产出：《文档问答功能 PRD + 接口字段说明》

第 9-12 周：React + Tailwind + AI Demo  
产出：《RealBot / TechKids 可交互 Demo》
