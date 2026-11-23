import { BookCallButton } from "@matt-ui/ui";
import { Calendar, MessageCircle } from "lucide-react";

export default function BookCallButtonCustomDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <BookCallButton
        variant="outline"
        tone="signal"
        label="预约设计评审"
        hoverLabel="选择时段"
        icon={<Calendar />}
      />
      <BookCallButton
        variant="primary"
        tone="emerald"
        size="sm"
        label="联系架构顾问"
        hoverLabel="立即沟通"
        icon={<MessageCircle />}
      />
    </div>
  );
}
