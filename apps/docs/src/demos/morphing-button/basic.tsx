"use client";

/**
 * 示例：MorphingButton。点击后依次经过处理中与成功，两秒后回到初始状态。
 */
import { MorphingButton, type MorphingButtonStatus } from "@matt-ui/motion";
import { useState } from "react";

export const MorphingButtonBasic = () => {
  const [status, setStatus] = useState<MorphingButtonStatus>("idle");

  const save = () => {
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1200);
    setTimeout(() => setStatus("idle"), 3200);
  };

  return (
    <MorphingButton
      status={status}
      labels={{ idle: "保存更改", loading: "保存中…", success: "已保存", error: "保存失败" }}
      onClick={save}
    />
  );
};
