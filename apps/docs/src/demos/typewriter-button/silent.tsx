import { TypewriterButton } from "@matt-ui/ui";

export default function TypewriterButtonSilentDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <TypewriterButton variant="signal" label="Sync shadcn Registry" charDuration={45} />
      <TypewriterButton
        variant="terminal"
        radius="default"
        prefix="$"
        cursorStyle="block"
        label="pnpm deploy --prod"
        sound={false}
      />
      <TypewriterButton variant="outline" size="sm" label="Silent typing mode" sound={false} />
    </div>
  );
}
