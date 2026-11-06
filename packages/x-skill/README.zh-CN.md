# Vue X Skill

面向 **ant-design-x-vue** 的 Agent Skill 文本。给 Cursor、Claude Code 等 IDE 用，教它们按 Vue SFC 和本仓库的包名写代码，而不是按 React 的 `@ant-design/x` + JSX 出码。

本目录只放 **skill 内容**，**尚未**以 `@ant-design-x-vue/x-skill` 发布到 npm，也没有再做一份 `npx x-skill` CLI。

## 安装到编辑器

把某一语言的 skill 目录拷到编辑器的 skills 路径即可。

### Cursor

```bash
mkdir -p .cursor/skills
cp -R packages/x-skill/skills-zh/* .cursor/skills/
```

用户级：拷到 `~/.cursor/skills/`。

### Claude Code

```bash
mkdir -p .claude/skills
cp -R packages/x-skill/skills-zh/* .claude/skills/
```

每个 skill 是含 `SKILL.md`（以及可选 `reference/`）的文件夹。装好后让 Agent 读这些 Vue skill，不要再去读 React 官方 `@ant-design/x-skill`。

英文正文在 `skills/`，中文正文在 `skills-zh/`（本仓库更推荐中文）。

## 与 React 官方 CLI 的关系

`npx x-skill` / `@ant-design/x-skill` 仍是 React 示例（`@ant-design/x`、JSX）。Vue 项目请以本目录为**主路径**，官方 CLI 仅作备选。
