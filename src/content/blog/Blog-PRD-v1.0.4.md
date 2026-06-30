---
title: 博客PRD v1.0.4
description: 图片全宽渲染、悬浮大纲缩略UI、代码架构组件化、布局一致性修复、深色浅色主题导航栏适配
pubDate: 2026-06-12
draft: false
tags:
  - 博客
---
# 背景

v1.0.3 实现了左侧常驻悬浮目录和章节高亮，但存在三个问题：文章样式与布局耦合在单文件中难以维护、常驻侧栏压缩正文空间、跨页面卡片位置漂移。

v1.0.4 围绕**交互体验升级**和**代码组件化**两条主线推进。

---

# 需求

## 1. 图片全宽渲染

正文图片从固定 960px 上限改为默认撑满内容区，`.wide-image`（1080px）和 `.small-image`（560px）作为显式约束类保留。

![图片全宽对比]

---

## 2. 大纲目录重构：侧栏 → 悬浮缩略 UI

### 2.1 设计理念

原侧边栏常驻占用正文空间。新方案参考浏览器设置面板：默认收起为缩略按钮，点击后展开浮层覆盖，正文独占全宽，用户三步完成操作（点按钮 → 选章节 → 阅读）。

### 2.2 交互

`缩略按钮 → 单击展开浮层（左侧滑入 + 半透明遮罩）→ 单击遮罩/按钮/章节链接/Esc 收起`

### 2.3 桌面端

缩略按钮嵌入顶部导航栏，紧贴主题切换按钮右侧，横排显示 "☰ 大纲 ●"（圆点为位置指示器）。点击后 TOC 面板从左侧滑入，宽 320px，当前章节高亮。

![image.png|350](https://res.cloudinary.com/dn3exco8l/image/upload/v1782745063/six-moon-blog/blog/72d1b66a23af93d7aa8bc135bee72e16.png)![image.png|350](https://res.cloudinary.com/dn3exco8l/image/upload/v1782744972/six-moon-blog/blog/9a686f2b2bd37c4f35420d7635624413.png)

### 2.4 移动端

按钮变为左下角圆形 FAB（直径 3.2rem），点击后同样从左侧滑入面板（宽 85vw）。深浅色模式下均有足够对比度。

![image.png|270](https://res.cloudinary.com/dn3exco8l/image/upload/v1782745093/six-moon-blog/blog/bf36a5f690f701389e02b8b25a40f6f8.png)![image.png|307](https://res.cloudinary.com/dn3exco8l/image/upload/v1782745105/six-moon-blog/blog/21c28d7ced28b863042d66d4152e2a46.png)

### 2.5 与原方案对比

|         | v1.0.3          | v1.0.4             |
| ------- | --------------- | ------------------ |
| TOC 默认态 | 侧边栏常驻，占用 grid 列 | 缩略按钮嵌入导航栏          |
| 正文宽度    | 与 TOC 共享空间      | 正文独占全宽             |
| 关闭方式    | 无               | 遮罩 / 按钮 / 链接 / Esc |
| 移动端     | 静态在正文上方         | FAB + 左侧滑入         |
| 位置感知    | 无               | 面板高亮 + 按钮圆点指示      |

---

## 3. 代码架构组件化

将 `Layout.astro`（260行）和 `[...slug].astro`（330行）中的内联样式与逻辑拆分为独立组件和样式文件。

- **Layout 拆解**：NavBar、Footer、ThemeScript 各自独立；全局 CSS 变量抽取为 `theme.css`；文章排版样式抽取为 `prose.css`
- **remark 插件模块化**：350 行单体拆为 7 个单职责模块（wiki-link / image-size / soft-break / urls 等）
- **新增组件**：`TocThumbnail.astro`（缩略按钮）、`FloatingToc.astro`（重写为 overlay 模式）

重构后 `Layout.astro` 从 260 行缩减至 35 行。

![image.png|273](https://res.cloudinary.com/dn3exco8l/image/upload/v1782745237/six-moon-blog/blog/708b7f90d65a6fa6c23c8be39f9c60c3.png)
**重构后**

---

## 4. 布局一致性与 Bug 修复

### 4.1 跨页面卡片漂移

两个根因：短页面无滚动条导致 ~17px 水平偏移（修复：`html { scrollbar-gutter: stable }`）；各页面 h1 margin 不一致（修复：统一到 Layout 全局声明）。

### 4.2 导航栏深浅色适配

v1.0.3 浅色主题下导航栏变量遗漏，始终显示深蓝黑色。v1.0.4 浅色主题改为浅灰白底 + 深色文字，与深色主题形成完整对应。

![image.png|233](https://res.cloudinary.com/dn3exco8l/image/upload/v1782745351/six-moon-blog/blog/8e2af5282c990a95c883cec6d9a51813.png)![image.png|242](https://res.cloudinary.com/dn3exco8l/image/upload/v1782745277/six-moon-blog/blog/0a443a7923b65aa6b87e044f2659b136.png)
**移动端**

![image.png|407](https://res.cloudinary.com/dn3exco8l/image/upload/v1782745312/six-moon-blog/blog/9e45b1f82cbd85141f764f700887e39b.png)![image.png|408](https://res.cloudinary.com/dn3exco8l/image/upload/v1782745367/six-moon-blog/blog/838a65d71a8c46c288a7c020f236df06.png)
**Web端**

### 4.3 导航栏 sticky

导航栏改为 `position: sticky`，滚动时始终冻结在页面顶部，同步设置 `scroll-padding-top` 确保锚点跳转不被遮挡。

### 4.4 主题切换修复

v1.0.3 重构时事件绑定脚本误放在 `<head>` 中，DOM 未渲染导致切换失效。修复为防闪烁脚本保留在 `<head>`，事件绑定回归 `<body>` 末尾。

---

# 设计决策

| # | 决策 |
|---|------|
| 1 | 缩略按钮嵌入导航栏（非独立悬浮），ThemeToggle 右侧 |
| 2 | 面板从左侧滑入（与按钮同侧） |
| 3 | 移动端左侧滑入（非底部抽屉） |
| 4 | 点击章节自动收起，三步操作最优 |
| 5 | 位置指示器当前版本实现（面板高亮 + 按钮圆点） |
| 6 | 导航栏 sticky 冻结 + 浅色主题适配 |

# [[Blog-PRDs|版本一览]]