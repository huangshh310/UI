# 交互底座 POC

用同一组 Playwright 断言对比 Base UI 与 Vercel UI SDK，为 [ADR-001](../../docs/architecture/ADR-001-interaction-engine.md) 提供实测依据。

这是一次性的验证代码，不属于对外发布的包。结论已写入 ADR-001，之后可以整体删除本目录。

## 运行

```bash
pnpm install
pnpm --filter @matt-ui/poc-interaction-engine exec playwright install chromium   # 首次运行需要
pnpm --filter @matt-ui/poc-interaction-engine poc:test
```

`poc:test` 会先做生产构建并启动服务（端口 3100），再运行全部用例。结果写入 `test-results/`：`report.json` 是完整报告，`js-bytes/` 是各页面的 JS 体积。

## 结构

| 位置           | 内容                                                           |
| -------------- | -------------------------------------------------------------- |
| `app/`         | 页面。每个页面是服务端组件，只负责挂载客户端内容               |
| `src/base-ui/` | Base UI 的实现：Select、Combobox、异步 Combobox、Dialog        |
| `src/ui-sdk/`  | UI SDK 的实现：以上四项，加上 Tree 和自行组合的 Reorder 原语   |
| `src/shared/`  | 两套实现共用的数据、模拟的异步搜索、Dialog 页面外壳            |
| `tests/`       | 行为规约。两套实现的页面遵守同一份契约，断言通过 ARIA 角色定位 |

## 已知偏差

两个用例用 `test.fail` 标记为预期失败，对应 Base UI 的两处行为。它们在报告里显示为失败图标，但计入通过。如果上游修复，用例会变成「意外通过」而报错，届时更新 ADR-001。

## 约束

UI SDK 处于 Beta，这里对它豁免了 7 天发布年龄策略。豁免只适用于本目录，`packages/` 下的包不得依赖 `@ui-sdk/*`。
