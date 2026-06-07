---
title: LMS-利好git/agent/人类三方的知识治理skills
pubDate: 2026-06-01
draft: false
tags:
  - 想法
  - 项目
description: 苦于工作区冗杂难维护整理？版本管理困难？Agent检索困难带来的token消耗？试试 LMS!
---
# local memory skills - 治理项目长期记忆的skills
>适用人群:学习者/产品/开发岗的本地记忆知识库
>推荐使用场景:初次使用Claude,Claude接入DeepSeek,对MCP工具有强需求的场景
>keyword ：no RAG,Local Memory,Auto Updating,git/agent/user三方可读,接近0的部署门槛/成本,适用Obsidian知识图谱

---
## 0. 先说结论

[LMS 链接](https://github.com/si6moonlxy-cyber/local-memory-skill) 点击转跳Github仓库 √

我想做的 LMS，不是 Learning Management System。

这里的 LMS 是：

```text
Local Memory Skill
```

它是一个给 AI Agent 用的本地记忆 Skill。

它的目标很朴素：

```text
让 Agent 不要每次都像失忆一样重新认识我、重新理解项目、重新学习限制条件。
```

但我不想第一版就上 RAG、SQLite、向量数据库、embedding、服务端、Web UI。

所以第一版只用：

```text
Markdown + sidecar YAML + Python + Git
```

一句话：

```text
Markdown 给人看，YAML 给 Agent 读，Git 负责历史。
```

## 1. 为什么我要做这个？

高强度使用 Agent 之后，我遇到的最大问题不是模型不够聪明，而是：

```text
它会忘。
```

不是那种完全忘，而是更麻烦的忘：

- 忘记我之前已经做过的技术决策。
- 忘记我不想在 MVP 阶段引入 RAG / SQLite / 向量库。
- 忘记我的沟通偏好：先解释方案，再让我做判断。
- 忘记项目边界，开始自作主张扩展范围。
- 忘记哪些内容只是推理，哪些内容才是事实。

这会导致一个很真实的成本：

```text
我不得不反复解释自己。
```

如果一个 Agent 每次都要我重新介绍背景，它就不是第二大脑，而是一个高级输入框。

## 2. 为什么不用传统知识库？

大部分知识库默认是给人看的。Agent 可以读，但不一定能稳定理解。

所以我希望记忆系统同时满足三方：

| 对象 | 需要什么 |
|---|---|
| Human | 打开 Markdown 就能读，能手动改 |
| Agent | 通过 YAML 知道类型、状态、摘要、tags |
| Git | 能 diff、能回滚、能审计 |

这就是 LMS 的底层设计：

```text
Human / Agent / Git 共读同一套本地记忆。
```

## 3. 为什么不用 RAG / SQLite / 向量库？

因为这是 MVP。

第一版要验证的不是“检索技术有多强”，而是：

```text
记忆结构本身是否可维护。
```

如果目录、字段、写回规则都没稳定，一上来做向量库，只会把问题藏起来。

所以第一版我选择非常克制：

- 不做 RAG。
- 不做 SQLite。
- 不做向量库。
- 不依赖外部服务。
- 不默认联网。

只做三件事：

```text
bootstrap.py        初始化 Memory 仓库
validate_memory.py  校验 Memory 不要坏掉
startup_memory.py   每次任务前生成启动上下文包
```

## 4. LMS 的目录长什么样？

初始化后大概是这样：

```text
<memory-root>/
  memory/
    user/
    project/
    restriction/
    task/
    submemory/
  scripts/
    bootstrap.py
    validate_memory.py
    startup_memory.py
  runtime/
  .lms/
    config.yaml
    config.example.yaml
```

其中最核心的是：

```text
user         记录我是谁、我怎么工作、我喜欢什么、不喜欢什么
project      记录持续项目的上下文和决策
restriction  记录 Agent 必须遵守的硬边界
task         记录一次具体任务
submemory    记录从任务里沉淀出来的可复用判断
runtime      记录本次启动读取的临时上下文
```

我很喜欢这个分层，因为它避免了两个极端：

```text
目录太少：所有文件堆在一起，Agent 又开始全量读取
目录太多：人类根本不想维护，系统变成目录迷宫
```

所以我的规则是：

```text
目录表达稳定边界，tags 表达灵活主题。
```

## 5. 小白配置教程

### 第一步：下载项目

会用 Git 的用户：

```bash
git clone <repo-url>
cd local-memory-skill
```

不会用 Git 的用户：

1. 打开 GitHub 项目页面。
2. 点击绿色的 `Code`。
3. 选择 `Download ZIP`。
4. 解压。
5. 打开解压后的 `local-memory-skill` 文件夹。

### 第二步：安装依赖

```bash
pip install pyyaml
```

### 第三步：运行初始化

```bash
python scripts/bootstrap.py
```

它只问两个问题：

```text
你的主要角色是什么？
你的 Memory 仓库路径是什么？
```

比如我可以这样填：

```text
游戏产品经理
D:/Project_Mine/Memory
```

注意：这个路径只是示例。你可以放到任何你自己的本地目录。

### 第四步：检查是否成功

```bash
python <memory-root>/scripts/validate_memory.py --memory-root <memory-root>
```

看到：

```text
OK: validation passed with N warning(s).
```

就说明结构基本可用了。

### 第五步：生成启动上下文包

```bash
python <memory-root>/scripts/startup_memory.py \
  --memory-root <memory-root> \
  --role <role-slug> \
  --project lms-mvp \
  --task "测试我的 LMS 是否能读取本地记忆"
```

然后打开：

```text
<memory-root>/runtime/context_bundle.md
<memory-root>/runtime/loaded_files.json
```

如果你看到 restriction、user profile、project、submemory、Agent Instruction，就说明 Agent 的启动读取流程跑通了。

## 6. Skill 安装包是什么？

源码仓库是给人看的，Skill 安装包是给 Agent runtime 用的。

```text
源码仓库：适合 GitHub、文档、开发和测试
skill.zip：适合安装到支持 Skill 的环境
```

一个 Skill 包通常包含：

```text
SKILL.md
agents/
scripts/
references/
templates/
examples/
README.md
README_CN.md
Skill-Analysis.md
```

如果你的 zip 解压后第一层是 `local-memory-skill/`，有些 runtime 可以接受；如果 runtime 要求 `SKILL.md` 在 zip 根目录，就把 `local-memory-skill/` 里面的内容重新压缩一次。

## 7. 我现在怎么看这个项目？

我觉得 LMS 第一版的价值不是“技术炫”。

它的价值是：

```text
让 AI Agent 的记忆变得可读、可控、可验证、可迁移。
```

这对新手尤其重要。

因为新手不一定懂 RAG、向量数据库、embedding，但他们能理解：

```text
这是我的 profile。
这是我的 project。
这是我的 restriction。
这是我的 task。
这是我沉淀出来的 submemory。
```

只要能理解，就能维护。

而只要能维护，Agent 的长期记忆就不再是黑盒。

---
*Written By Six_moon*