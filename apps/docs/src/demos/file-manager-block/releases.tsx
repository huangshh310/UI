"use client";

import { FileManagerBlock } from "@matt-ui/motion";

const RELEASE_ASSETS = [
  {
    id: "r1",
    name: "matt-ui-ui-0.4.0.tgz",
    folder: "npm 产物",
    sizeLabel: "64 KB",
    updatedAt: "刚刚",
  },
  {
    id: "r2",
    name: "matt-ui-motion-0.4.0.tgz",
    folder: "npm 产物",
    sizeLabel: "38 KB",
    updatedAt: "5 分钟前",
  },
  {
    id: "r3",
    name: "axe-audit-report.json",
    folder: "门禁报告",
    sizeLabel: "19 KB",
    updatedAt: "12 分钟前",
  },
];

export default function FileManagerBlockReleasesDemo() {
  return <FileManagerBlock initialFiles={RELEASE_ASSETS} />;
}
