"use client";

import { AiPromptGallery } from "@matt-ui/ui";
import { useState } from "react";

export default function AiPromptGalleryDesignDemo() {
  const [picked, setPicked] = useState("点击任意卡片注入指令");

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-2.5">
      <AiPromptGallery onSelect={(tpl) => setPicked(`已选中：${tpl.title}`)} />
      <span className="font-mono text-xs text-muted-foreground">{picked}</span>
    </div>
  );
}
