import { MagneticButton } from "@matt-ui/motion";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

export default function MagneticButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3.5">
      <MagneticButton variant="signal" strength={0.4}>
        信号色主操作
        <ArrowUpRightIcon weight="bold" aria-hidden="true" />
      </MagneticButton>
      <MagneticButton variant="outline" strength={0.3}>
        发丝描边
      </MagneticButton>
      <MagneticButton variant="secondary" radius="default" size="sm" strength={0.25}>
        轻度磁吸
      </MagneticButton>
      <MagneticButton variant="primary" size="lg" strength={0.55}>
        强磁吸主按钮
      </MagneticButton>
    </div>
  );
}
