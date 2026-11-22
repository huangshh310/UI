"use client";

/**
 * 复制按钮：把一段文本写入剪贴板，并短暂显示「已复制」的反馈。
 */
import { Button } from "@matt-ui/ui";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

/** 「已复制」反馈的持续时间 */
const FEEDBACK_MS = 1600;

interface CopyButtonProps {
  /** 要复制的文本 */
  text: string;
  /** 按钮的可访问名称，说明复制的是什么 */
  label: string;
}

export const CopyButton = ({ text, label }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), FEEDBACK_MS);
  };

  return (
    <>
      <Button variant="ghost" size="icon" aria-label={label} onClick={copy}>
        {copied ? (
          <CheckIcon weight="bold" aria-hidden="true" />
        ) : (
          <CopyIcon weight="bold" aria-hidden="true" />
        )}
      </Button>
      {/* 向屏幕阅读器播报复制结果 */}
      <output className="sr-only">{copied ? "已复制" : ""}</output>
    </>
  );
};
