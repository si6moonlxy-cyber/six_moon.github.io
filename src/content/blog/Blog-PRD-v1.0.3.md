---
title: 博客PRD v1.0.3
description: 文章页左侧悬浮目录、章节折叠交互与阅读体验优化
pubDate: 2026-05-13
draft: false
tags:
  - 博客
---
# 背景

博客文章页已完成基础 Markdown 渲染、深浅色主题、代码块、表格、链接、标题样式，以及基于文章标题自动生成的悬浮目录（v1.0.2 实现）。

# 需求

## 1. 目录位置与布局调整
- 将目录从右侧悬浮改为左侧侧边导航
- 桌面端使用 CSS Grid 实现左侧目录 + 中间正文的双列布局
- 目录使用 `position: sticky` 固定在左侧阅读区，不使用高 `z-index`
- 小屏幕下目录回到文章上方，不使用 `fixed` 浮层遮挡正文
- 无 H2-H4 目录项的文章不渲染空侧栏，保持普通文章宽度
![ae7e96b1cdb296447e75d64fdac4cf95.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778715466/six-moon-blog/blog/b70ca3a79bf0b59d178496c7ef37e899.png)
![3c9631169c32307d8aba8b7ca7565969.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778715466/six-moon-blog/blog/b70ca3a79bf0b59d178496c7ef37e899.png)

## 2. 目录结构与交互
- 根据 Markdown headings 生成 H2 → H3 → H4 的树状目录
- H2 下存在子标题时显示折叠按钮
- 点击 H2 标题文本跳转章节；点击折叠按钮只控制子目录展开状态
- 当前章节通过 `IntersectionObserver` 高亮，并自动展开所在 H2 分组
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778715478/six-moon-blog/blog/e7547e34aa030aa36761cf42d8d5ba5b.png)

## 3. 样式与兼容性
- 目录增加内部滚动、边框、阴影、深浅色兼容、长标题换行等样式
- 给正文标题设置 `scroll-margin-top`，避免锚点跳转后被顶部导航遮挡
- 使用 CSS 变量继承现有深浅色主题，不引入大型 UI 库
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778715531/six-moon-blog/blog/759aa68b067a0de1f086cad893e8c6c9.png)
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1778715533/six-moon-blog/blog/e5a864d68f964b9d011e01cd3b1ecfd1.png)

---
# 设计决策

| # | 决策 |
|---|------|
| 1 | TOC 放左侧侧边栏，使用 CSS Grid + sticky 定位（非 fixed 浮层） |
| 2 | h2-h3-h4 树状结构，有子标题时默认折叠 |
| 3 | 折叠按钮控制子目录展开/收起，点击标题文本跳转章节 |
| 4 | IntersectionObserver 高亮当前章节，并自动展开所在 h2 分组 |
| 5 | 无 h2-h4 标题的文章不渲染 TOC 侧栏，保持普通文章宽度 |
| 6 | 移动端 TOC 在正文上方静态展示（非 fixed 浮层） |

# [[Blog-PRDs|版本一览]]