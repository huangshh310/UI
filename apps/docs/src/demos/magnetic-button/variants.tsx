import { MagneticButton } from "@matt-ui/motion";

export default function MagneticButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <MagneticButton strength={0.25}>轻度磁吸（0.25）</MagneticButton>
      <MagneticButton strength={0.55}>强烈磁吸（0.55）</MagneticButton>
    </div>
  );
}
