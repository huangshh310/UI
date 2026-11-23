"use client";

/**
 * 示例：StretchSwitch 的视觉形态（card / pill / row）、三档尺寸与滑块内图标。
 */
import { StretchSwitch } from "@matt-ui/motion";
import { Bell, Moon, ShieldCheck, Sun, Wifi } from "lucide-react";

export default function StretchSwitchVariantsDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <StretchSwitch size="sm" label="紧凑 sm" defaultChecked />
        <StretchSwitch size="md" label="标准 md" tone="signal" defaultChecked />
        <StretchSwitch
          size="lg"
          label="深色外观"
          tone="primary"
          defaultChecked
          thumbIcon={{
            checked: <Moon className="size-3" />,
            unchecked: <Sun className="size-3" />,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <StretchSwitch
          variant="pill"
          size="sm"
          tone="success"
          icon={<Wifi className="size-3.5" />}
          label="局域网同步"
          defaultChecked
        />
        <StretchSwitch
          variant="pill"
          size="sm"
          tone="signal"
          icon={<Bell className="size-3.5" />}
          label="静默免打扰"
        />
      </div>

      <StretchSwitch
        variant="card"
        tone="signal"
        icon={<ShieldCheck className="size-4" />}
        label="登录异常二次校验"
        description="检测到新设备或异地 IP 时自动弹出安全码确认。"
        badge="推荐"
        defaultChecked
      />
    </div>
  );
}
