/**
 * 示例：MagneticButton。把指针移到按钮附近，它会被吸过来。
 */
import { MagneticButton } from "@matt-ui/motion";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

export const MagneticButtonBasic = () => (
  <MagneticButton>
    启动控制台
    <ArrowUpRightIcon weight="bold" aria-hidden="true" />
  </MagneticButton>
);
