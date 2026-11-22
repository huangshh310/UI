import { BookCallButton } from "@matt-ui/ui";

export default function BookCallButtonCustomDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <BookCallButton label="预约设计评审" />
      <BookCallButton label="联系架构顾问" />
    </div>
  );
}
