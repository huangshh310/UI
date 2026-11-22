/**
 * 示例：DragToConfirm。把滑块拖到尽头确认；也可以聚焦滑块后按 Enter。
 */
import { DragToConfirm } from "@matt-ui/motion";

export const DragToConfirmBasic = () => (
  <DragToConfirm label="滑动以删除项目" confirmedLabel="已删除" />
);
