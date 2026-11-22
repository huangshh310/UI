# ADR-003：组件包用 tsc 逐文件构建，不使用打包器

- 状态：已采纳
- 日期：2026-11-22

## 背景

蓝图把「Vite Library Mode 或经验证的维护中构建工具」列为包构建的候选。Phase 0 的计划写的是 Vite Library Mode，实施时改用了 `tsc`，这里记录原因。

组件库的产物有两个要求：

1. 每个源文件对应一个产物文件，使用者的打包器才能按需摇树，文件顶部的 `"use client"` 指令也才能原样保留。
2. 产出的 JS 与 `.d.ts` 中的相对导入必须带扩展名，这样在 Node 原生 ESM 和 `moduleResolution: nodenext` 的使用者那里都能解析。

## 决策

`@matt-ui/utils` 与 `@matt-ui/ui` 都用 `tsc -p tsconfig.build.json` 构建，同时产出 JS 与类型声明。`@matt-ui/ui` 的样式由 Tailwind CLI 单独产出 `dist/styles.css`。

源码采用 `module: nodenext`，相对导入写 `.js` 扩展名。

## 原因

`tsc` 的逐文件输出天然满足上面两个要求。使用打包器则需要额外配置保留模块结构、外部化依赖，并且仍然要靠 `tsc` 产出类型声明。在样式已经单独构建的前提下，打包器没有带来 `tsc` 做不到的事情，却多出一份配置和一组依赖。

## 验证

用一个带 `"use client"`、JSX 和 Token 工具类的临时组件跑过完整构建：

- 产物保留了 `"use client"`，JSX 编译为 `react/jsx-runtime` 调用，`react` 没有被打进产物；
- `dist/styles.css` 中的工具类解析到了 `var(--ui-*)`，`dark:` 变体跟随 `.dark` 与 `data-theme="dark"`。

临时组件验证后已删除。

## 何时重新评估

组件需要从 JS 中导入非代码资源（SVG 文件、CSS Modules 等）时，`tsc` 无法处理，届时再引入打包器。
