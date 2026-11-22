/**
 * 类型可用性检查：只在类型检查时使用，不参与运行。
 * 如果包的类型声明缺失或 exports 配置有误，这个文件无法通过编译。
 */
import type { ButtonProps, ButtonSize, ButtonVariant } from "@matt-ui/ui";

const variant: ButtonVariant = "signal";
const size: ButtonSize = "icon";

export const props: ButtonProps = { variant, size, loading: true, "aria-label": "Search" };
