---
title: Claude code 常用/指令一览
description: 内含Claude原生指令,compact压缩上下文,/init初始化Claude.md等等
pubDate: 2026-05-27
draft: false
tags:
  - 想法
---


# Claude code 常用`/`指令
>适用人群:使用Claude加入工作流中的人
>推荐使用场景:需要使用Claude原生的**多任务/代码隔离/压缩上下文**等


Claude Code 里 `/` 指令很多，但你日常真正高频用这些就够了。
官方说明：在会话里输入 `/` 可以查看你当前可用的所有命令；
不同平台、套餐、环境会显示不同命令。命令必须放在消息开头，后面的文字会作为参数传给命令。([Claude Code](https://code.claude.com/docs/en/commands "Commands - Claude Code Docs"))

---
## 最常用 15 个

| 指令                 | 用途                   | 什么时候用               |
| ------------------ | -------------------- | ------------------- |
| `/help`            | 查看帮助和可用命令            | 忘了命令时               |
| `/init`            | 初始化项目，生成 `CLAUDE.md` | 第一次接入项目             |
| `/memory`          | 编辑/管理 `CLAUDE.md` 记忆 | 修改项目规则              |
| `/mcp`             | 管理 MCP 连接            | 接 Figma、GitHub、数据库等 |
| `/permissions`     | 管理工具权限               | 配 Auto、允许/拒绝命令      |
| `/plan`            | 进入计划模式               | 大改代码前               |
| `/model`           | 切换模型                 | 任务难度变化时             |
| `/effort`          | 调整推理强度               | 复杂 bug / 架构分析       |
| `/clear`           | 清空当前上下文，开新任务         | 换任务时                |
| `/compact`         | 压缩长上下文               | 聊太久但不想重开            |
| `/context`         | 查看上下文占用              | Claude 开始变慢/跑偏      |
| `/diff`            | 查看本轮/当前代码改动          | 提交前检查               |
| `/code-review`     | 审查当前 diff            | 提交前找 bug            |
| `/security-review` | 安全审查                 | 改鉴权、API、数据库时        |
| `/usage`           | 查看用量/成本/限制           | 控制消耗                |

官方 commands 页也把这些分到典型工作流里：首次进 repo 用 `/init`、`/memory`、`/mcp`、`/permissions`；
任务中用 `/plan`、`/model`、`/effort`；
上下文长了用 `/context`、`/compact`；
发布前用 `/diff`、`/code-review`、`/security-review`。([Claude Code](https://code.claude.com/docs/en/commands "Commands - Claude Code Docs"))

## 你这种场景最该会的

### 1. 接 Figma / MCP

```text
/mcp
```

用于看 MCP 是否连上、做 OAuth、管理服务器连接。
你的 Figma MCP 文章里也是先用 `/MCP` 检查 `figma` 是否 connected，再让 Claude 读取 Figma 文件。

### 2. 初始化三个项目

分别在博客、DevOps Web、儿童编程游戏项目根目录执行：

```text
/init
```

然后再用：

```text
/memory
```

把项目规范写进去，比如技术栈、禁止事项、测试命令、设计范式。
官方说 `/init` 用来生成项目 `CLAUDE.md`，`/memory` 用来编辑记忆文件。([Claude Code](https://code.claude.com/docs/en/commands "Commands - Claude Code Docs"))

### 3. 大改前先规划

```text
/plan 新增儿童编程游戏的关卡选择页
```

适合避免 Claude 一上来乱改文件。
官方说明 `/plan [description]` 可以直接进入 plan mode，并带着任务描述开始规划。([Claude Code](https://code.claude.com/docs/en/commands "Commands - Claude Code Docs"))

### 4. 改完看 diff

```text
/diff
```

看 Claude 到底改了哪些文件。提交前再跑：

```text
/code-review high
```

或：

```text
/security-review
```

`/code-review` 是审查当前 diff 的 bundled skill；
`/security-review` 用来分析当前分支待提交改动里的安全风险。([Claude Code](https://code.claude.com/docs/en/commands "Commands - Claude Code Docs"))

### 5. 上下文太长时

```text
/context
```

看上下文占用。

```text
/compact
```

压缩上下文，继续当前任务。

```text
/clear
```

彻底开新任务。

官方区分得很清楚：`/clear` 是新会话空上下文；
如果还要继续同一个任务，只是释放上下文，应使用 `/compact`。([Claude Code](https://code.claude.com/docs/en/commands "Commands - Claude Code Docs"))

## 进阶但很有用

| 指令                     | 用途             |
| ---------------------- | -------------- |
| `/agents`              | 管理 subagents   |
| `/batch <instruction>` | 大规模并行改造代码库     |
| `/tasks`               | 查看后台任务         |
| `/background` 或 `/bg`  | 把当前会话放后台跑      |
| `/resume`              | 恢复历史会话         |
| `/rewind`              | 回滚到之前检查点       |
| `/hooks`               | 查看 hook 配置     |
| `/skills`              | 查看可用 skills    |
| `/run`                 | 启动并验证 app      |
| `/verify`              | 构建/运行 app 验证改动 |

`/run`、`/verify`、`/batch`、`/code-review` 这类不是普通内置命令，而是 Claude Code 的 bundled skills；
官方说 skills 也可以像命令一样用 `/skill-name` 调用。([Claude API Docs](https://docs.anthropic.com/en/docs/claude-code/slash-commands "Extend Claude with skills - Claude Code Docs"))

## 你的三个项目推荐命令组合

### 个人博客

```text
/init
/memory
/plan 优化博客文章 frontmatter 和 SEO
/diff
/code-review
```

### DevOps 项目管理 Web

```text
/plan 新增项目风险看板
/mcp
/permissions
/diff
/code-review high
/security-review
```

### 儿童编程游戏教学

```text
/plan 设计儿童编程关卡系统
/run
/verify
/diff
/code-review
```

## 最该记住的一句话

日常 80% 场景记住这 7 个就够：

```text
/init
/memory
/mcp
/plan
/diff
/code-review
/compact
```