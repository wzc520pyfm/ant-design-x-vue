# Vue X Skill

面向 **ant-design-x-vue** 的 Agent Skill 文本。给 Cursor、Claude Code 等 IDE 用，教它们按 Vue SFC 和本仓库的包名写代码，而不是按 React 的 `@ant-design/x` + JSX 出码。

包名：`@ant-design-x-vue/x-skill@2.10.0`。

## 安装

```bash
# 全局安装
npm i -g @ant-design-x-vue/x-skill
npx @ant-design-x-vue/x-skill
# 或全局安装后
x-skill-vue
```

常用参数：`--cursor`、`--claude`、`--global`、`--lang zh|en`、`--force`、`--help`、`--version`。

CLI 会把 `skills/` 或 `skills-zh/` 复制到 `.cursor/skills` 和/或 `.claude/skills`，不依赖 figlet，也不会去装 React 的 `@ant-design/x-skill`。

### 手动拷贝

```bash
mkdir -p .cursor/skills
cp -R node_modules/@ant-design-x-vue/x-skill/skills-zh/* .cursor/skills/
```

用户级：`~/.cursor/skills/` 或 `~/.claude/skills/`。

英文正文在 `skills/`，中文正文在 `skills-zh/`。

## 与 React 官方 CLI 的关系

`npx x-skill` / `@ant-design/x-skill` 仍是 React 示例（`@ant-design/x`、JSX）。Vue 项目请以本包为**主路径**。
