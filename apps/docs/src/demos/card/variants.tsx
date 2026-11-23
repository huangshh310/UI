"use client";

import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@matt-ui/ui";

const SURFACES = [
  {
    variant: "default",
    title: "Default",
    badge: "默认",
    desc: "发丝边框与克制微影，适合通用信息容器。",
  },
  {
    variant: "elevated",
    title: "Elevated",
    badge: "抬升",
    desc: "柔和多层漫射微影，用于核心聚焦面板。",
  },
  {
    variant: "subtle",
    title: "Subtle",
    badge: "柔和",
    desc: "轻量浅灰底面，适合内嵌分组与次级模块。",
  },
  {
    variant: "glass",
    title: "Glass",
    badge: "磨砂",
    desc: "半透明背景模糊材质，贴合悬浮浮层与渐变画布。",
  },
] as const;

export default function CardVariantsDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      {SURFACES.map((item) => (
        <Card key={item.variant} variant={item.variant}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.desc}</CardDescription>
            <CardAction>
              <Badge variant="outline" size="sm">
                {item.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            variant=&quot;{item.variant}&quot;
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
