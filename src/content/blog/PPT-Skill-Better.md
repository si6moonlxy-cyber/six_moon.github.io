---
title: PPT Skill 的具体生产实践
description: 使用Claude code 挂载 PPT Skill,生成牛皮纸风PPT,快捷输出PPT
pubDate: 2026-05-27
draft: false
tags:
  - 想法
  - 项目
---
# PPT Skill 的具体生产实践
>适用人群:任何需要制作PPT的人群
>推荐使用场景:输出有风格样式的汇报PPT

---
## 1. 选择一款PPT Skill

此处我选择Github订阅最多的PPT Skill :  [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) star 有12.5k
![image.png|376](https://res.cloudinary.com/dn3exco8l/image/upload/v1779891841/six-moon-blog/blog/056f3222caa20a6c28568f5d788a0ac3.png)![GitPPTSkill.png|377](https://res.cloudinary.com/dn3exco8l/image/upload/v1779892123/six-moon-blog/blog/b4803fe0c170bee7440e73150e0d341b.png)

**官方提供两种安装方式** 

1. 命令行安装
```
npx skills add https://github.com/op7418/guizang-ppt-skill --skill guizang-ppt-skill
```

2. 任意Agent安装
```
帮我安装 `guizang-ppt-skill` 这个 Claude Code skill。请按下面步骤做:

1. 确保 `~/.claude/skills/` 目录存在(不存在就创建)
2. 执行 `git clone https://github.com/op7418/guizang-ppt-skill.git ~/.claude/skills/guizang-ppt-skill`
3. 验证： `ls ~/.claude/skills/guizang-ppt-skill/` 应该看到 `SKILL.md` 、 `assets/` 、 `references/` 三项
4. 告诉我安装好了,之后我说"做一份杂志风 PPT"之类的话就会触发这个 skill
```

**风格一览**
电子杂志主题  和   瑞士主题
![电子杂志主题.png|330](https://res.cloudinary.com/dn3exco8l/image/upload/v1779892181/six-moon-blog/blog/341c62698fbaa841a697dd344e550515.png)![瑞士主题.png|352](https://res.cloudinary.com/dn3exco8l/image/upload/v1779892184/six-moon-blog/blog/5d169434f143ebb64a3d0d34cf782a67.png)

---
## 2. 使用Claude加载Skill并且进行创作

**装好后,Claude Code 会在对话里自动发现并调用这个 skill。触发关键词:**

- "帮我做一份杂志风 PPT"
- "帮我做一份瑞士风 PPT"
- "生成一个 horizo​​ntal swipe deck"
- “杂志式编辑风格呈现”
- "electronic ink 风格演讲 slides"
- "基于这篇文章做一张公众号 21:9 封面"
- "基于这份 PPT 生成一张 1:1 分享卡"

**我这里使用一个文章 + 牛皮纸风格创造PPT**
![Claude.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1779892462/six-moon-blog/blog/ab19e5b765542574e132035c0a6a429a.png)
稍等片刻 ...... 

---
## 3. PPT微调与审查

现在,Claude会输出一份HTML文档,现在需要通过浏览器打开HTML文件并且检查插入图片的页码
在 `~. /assets/screenshots` 目录下根据页面命名要插入的图片,如:Page-08.png 等
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1779892683/six-moon-blog/blog/8e99823d452b3804e1a0534bd046cc18.png)

随后跟Claude对话,按命名方式插入对应页码,并且设置好大小

---
## 4. 验收

**展示PPT时间**
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1779892968/six-moon-blog/blog/64ecba19bd1738d1dd7769ec9d27a207.png)
![image.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1779892916/six-moon-blog/blog/3a18c0cae62d9ff5498b4d4e0ab0b96a.png)

总体来说还是不错的,唯一花费时间的就是投喂的元文档;
但充其量算是个人做ppt的台本迁移