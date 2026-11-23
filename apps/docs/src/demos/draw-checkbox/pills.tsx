"use client";

/**
 * 示例：C 端兴趣偏好与多选筛选胶囊（pill 变体 + 圆形勾选）。
 */
import { DrawCheckbox } from "@matt-ui/ui";
import { Cpu, Eye, Layers, Moon, Palette, Sliders, Sparkles, Type } from "lucide-react";
import { useState } from "react";

const TOPICS = [
  { id: "motion", label: "微交互动效", icon: <Sparkles className="size-3.5" /> },
  { id: "type", label: "字体与排版", icon: <Type className="size-3.5" /> },
  { id: "system", label: "设计系统", icon: <Layers className="size-3.5" /> },
  { id: "ai", label: "AI 交互界面", icon: <Cpu className="size-3.5" /> },
  { id: "color", label: "色彩与材质", icon: <Palette className="size-3.5" /> },
  { id: "dark", label: "暗黑模式", icon: <Moon className="size-3.5" /> },
  { id: "a11y", label: "无障碍体验", icon: <Eye className="size-3.5" /> },
  { id: "tokens", label: "Design Tokens", icon: <Sliders className="size-3.5" /> },
];

export const DrawCheckboxPills = () => {
  const [selected, setSelected] = useState<string[]>(["motion", "system", "ai"]);

  const toggle = (id: string, next: boolean) =>
    setSelected((prev) => (next ? [...prev, id] : prev.filter((item) => item !== id)));

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight text-foreground">定制你的灵感频道</p>
          <p className="text-xs text-muted-foreground">选择至少 2 个感兴趣的主题以生成推荐流。</p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] font-medium text-foreground tabular-nums">
          已选 {selected.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <DrawCheckbox
            key={topic.id}
            variant="pill"
            shape="circle"
            size="sm"
            tone="signal"
            label={topic.label}
            icon={topic.icon}
            checked={selected.includes(topic.id)}
            onCheckedChange={(next) => toggle(topic.id, next)}
          />
        ))}
      </div>
    </div>
  );
};
