import { cva } from "class-variance-authority";
import type { AiStackCause, AiStackCommand, AiStackFrame } from "./ai-stack-trace.types.js";

export const aiStackTraceContainerVariants = cva("w-full text-foreground", {
  variants: {
    variant: {
      card: "rounded-2xl border border-border bg-card/95 p-4 shadow-sm sm:p-5",
      seamless: "bg-transparent p-0",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const STACK_DEFAULT_COMMAND: AiStackCommand = {
  command: "curl -sf localhost:3000/api/users",
  exitCode: 22,
  duration: "1.8s",
};

export const STACK_DEFAULT_FRAMES: AiStackFrame[] = [
  {
    id: "f-undici",
    location: "node:internal/deps/undici/undici:13510:13",
  },
  {
    id: "f-users",
    fn: "async getUsers",
    location: "lib/users.ts:10:26",
    snippet: {
      file: "lib/users.ts",
      lines: [
        {
          lineNumber: 7,
          content: 'const ACCOUNTS_URL = process.env.ACCOUNTS_URL ?? "http://127.0.0.1:8787";',
        },
        { lineNumber: 8, content: "" },
        { lineNumber: 9, content: "export async function getUsers(): Promise<User[]> {" },
        {
          lineNumber: 10,
          content: "  const response = await fetch(`${ACCOUNTS_URL}/users`, {",
          highlight: true,
        },
        { lineNumber: 11, content: "    next: { revalidate: 60 }," },
        { lineNumber: 12, content: "  });" },
        { lineNumber: 13, content: "  const rows: UserRow[] = await response.json();" },
        { lineNumber: 14, content: "  return rows.map(toUser);" },
        { lineNumber: 15, content: "}" },
      ],
    },
  },
  {
    id: "f-route",
    fn: "async GET",
    location: "app/api/users/route.ts:8:17",
  },
  {
    id: "f-fw-1",
    fn: "AppRouteRouteModule.do",
    location: "next/dist/server/route-modules/app-route/module.js:412:21",
    framework: true,
    frameworkLabel: "next",
  },
  {
    id: "f-fw-2",
    fn: "AppRouteRouteModule.handle",
    location: "next/dist/server/route-modules/app-route/module.js:518:30",
    framework: true,
    frameworkLabel: "next",
  },
  {
    id: "f-fw-3",
    fn: "NextNodeServer.handleCatchallRenderRequest",
    location: "next/dist/server/next-server.js:304:19",
    framework: true,
    frameworkLabel: "next",
  },
];

export const STACK_DEFAULT_CAUSE: AiStackCause = {
  name: "Error",
  code: "ECONNREFUSED",
  message: "connect ECONNREFUSED 127.0.0.1:8787",
};
