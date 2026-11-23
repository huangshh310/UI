/**
 * 示例：Context 平铺面板形态（variant="inline"），支持点击图例高亮单一分段。
 */
import { Context } from "@matt-ui/ui";

export default function ContextInlineDemo() {
  return <Context variant="inline" surface="glass" modelName="gpt-5-codex" costLabel="~$0.031" />;
}
