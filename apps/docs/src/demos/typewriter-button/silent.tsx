import { TypewriterButton } from "@matt-ui/ui";

export default function TypewriterButtonSilentDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <TypewriterButton label="Sync shadcn Registry" charDuration={45} />
      <TypewriterButton label="Silent typing mode" sound={false} />
    </div>
  );
}
