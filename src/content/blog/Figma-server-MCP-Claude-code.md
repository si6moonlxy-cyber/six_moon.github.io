---
title: Claude code使用MCP接入Figma server一站式生成原型图
description: |
  使用cc-switch代理Figma MCP接入Claude code制作SVG原型图
pubDate: 2026-05-25
draft: false
tags:
  - 想法
  - 项目
---
# Claude code 和 Figma 的碰撞艺术
>适用人群:前端工程师,产品经理,全栈工程师,个人开发者
>推荐使用场景:根据范式开发页面,快速输出原型图

---
## 1. 解决"Yes"工程师的烦恼

```
"Claude,给我做一个Mobile端的小程序原型图"

"xxxxxxx? yes" "xxxxxxx? yes" "xxxxxxx? yes" ......
```
在使用Claude之前,很多人都经历过上面的情况,一个短短五分钟就可以结束的流程,偏偏点"Yes"点了三四分钟

### 首先是明确模式差异
```
模式	      极致简化
Plan	      只动脑，不动手（只读）
Default	      任何操作都问你
AcceptEdits	  改代码不问，跑命令还要问
Auto	      AI 帮你判断，高危才拦，连续拒绝3次就退回问人
DontAsk	      只准用白名单里的工具，其它全拒
YOLO	      不问、不拦，全自动，后果自负
```
目前只推荐使用 **Auto** 模式,方便快捷

### 配置Claude的全局Setting.json
1. **找到配置文件**：
	- `~/.claude/settings.json`：影响你所有项目的全局配置文件。
	- `<你的项目根目录>/.claude/settings.json`：仅影响当前项目的配置文件。
2. **编辑内容**：用以下内容替换配置文件，以实现默认开启 `Auto` 模式并将 `Bash` 和 `Edit` 命令加入允许列表:
``` json
{
  "permissions": {
    "defaultMode": "auto", // 设置默认权限模式为 "auto"
    "allow": [
      "Bash", // 允许执行所有 Bash 命令
      "Edit"  // 允许编辑所有文件
    ]
  }
}
```

![badc5f7486fd5a4f23977e58271a627e.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1779718524/six-moon-blog/blog/6a43141ff4777ac0dd9bd038526299a0.png)

### 检验当前模式
1. CLI启动Claude
2. 直接自然语言询问
![a722a45b8debea29d5fc6fc0c64ba97a.png](https://res.cloudinary.com/dn3exco8l/image/upload/v1779718581/six-moon-blog/blog/139da666459feb74b4bb386133264ba4.png)

显示Auto模式,即表示进入自动模式


---

## 2. Figma MCP 建立

### 1. 拿到你的 Figma 访问令牌

打开 Figma → 个人设置 → **Personal Access Tokens** → 输入名字生成一个 token。



> 记下这串 token，后面要用。

### 2. 拿到文件信息

打开你的 Figma 设计稿，地址栏里找到：
- **File Key** — 在链接的 `/file/` 后面那一串
- **Node ID** — 如果你只想读取某个画板，右键复制链接就能拿到

### 3. 配置 MCP

打开 Claude Code 的配置文件 `~/.claude/settings.json`，加入 Figma MCP：

```json
{
  "mcpServers": {
    "figma": {
      "type": "url",
      "url": "https://figma-server.example.com/sse",
      "env": {
        "FIGMA_ACCESS_TOKEN": "你的token"
      }
    }
  }
}
```

也可以用 `cc-switch` 图形化配置，在 MCP 面板里填入 token 就行，省得手写 JSON。

---

## 3. Claude code 使用 "/MCP" 查看Figma

### 1. 确认连接

打开终端，进入你的项目目录，启动 Claude Code：

```bash
claude
```

输入：

```
/MCP
```

如果看到 `figma` 显示绿色（已连接），说明成功了。



### 2. 试试能不能读到 Figma

直接问 Claude：

> 读取我的 Figma 文件 [file key]，告诉我这个设计稿里有哪些页面。

如果配置正确，Claude 会调用 MCP 工具去 Figma 拉数据，然后告诉你结果。

---

## 4. 添加范式

光能读还不够，得让 Claude 知道你想要什么风格的原型。

在项目里新建一个文件 `prompts/原型范式.md`，写下你的规矩。比如：

```markdown
## 原型规范
- 使用简洁的卡片式布局
- 主色调：#4A6CF7
- 字体：无衬线字体
- 输出格式：独立 HTML 文件，可浏览器直接打开
- 移动端优先，适配 375px 宽度
```

然后在 Claude Code 里告诉它：

> 按照我的原型范式，读取 Figma 设计稿并生成页面。

这样每次输出的风格都是统一的，不用每次重新描述一遍。

你也可以在会话里直接粘贴范式，Claude 会记住当前会话的偏好。
如果范式需要长期复用或者跟随项目，可以在项目根目录的 CLAUDE.md 文件中配置工具使用方式，使得 Claude 能够自动理解你的设计规范并关联到 Figma 组件。

---

## 5. 输出原型/Demo

一切就绪后，一条指令就能出活。

例子：

> 参照 Figma 文件 [file key] 中的登录页面设计，按我的范式生成一个可交互的 HTML 原型。

Claude 会：
1. 通过 MCP 读取 Figma 中的图层、颜色、文字、间距
2. 根据你的范式转换成代码
3. 直接在当前目录生成原型文件



打开 `.html` 文件就能在浏览器里看到效果，可以直接拿去演示或评审。

不满意就告诉 Claude "把按钮改圆角""间距调大一点"，几秒钟改好。

以前花 2 小时画原型，现在 2 分钟搞定。多出来的时间，用来想"这样做对不对"，而不是"这个按钮该放哪"。

---
*Written By Six_moon*