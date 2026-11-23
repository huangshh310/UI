"use client";

/**
 * 示例：LockInput 的四种视觉变体、胶囊圆角与单色焦点环。
 */
import { LockInput } from "@matt-ui/ui";
import { AtSign, Search } from "lucide-react";

export const LockInputVariants = () => (
  <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
    <LockInput
      label="卡片描边 · default"
      variant="default"
      placeholder="name@company.com"
      clearable
    />
    <LockInput
      label="柔灰填充 · filled"
      variant="filled"
      prefix={<Search className="size-4" />}
      placeholder="搜索团队成员…"
      clearable
    />
    <LockInput
      label="极简透明 · ghost"
      variant="ghost"
      ringTone="neutral"
      placeholder="输入自定义标签"
      clearable
    />
    <LockInput
      label="底部基线 · underline"
      variant="underline"
      placeholder="输入工作区名称"
      clearable
    />
    <LockInput
      label="胶囊样式 · radius=full"
      variant="filled"
      radius="full"
      prefix={<Search className="size-4" />}
      placeholder="快速筛选组件…"
      shortcut="⌘K"
      clearable
    />
    <LockInput
      label="中性单色环 · ringTone=neutral"
      ringTone="neutral"
      prefix={<AtSign className="size-4" />}
      defaultValue="matt-studio"
      clearable
    />
  </div>
);
