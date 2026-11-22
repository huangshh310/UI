/**
 * POC 应用的 Next.js 配置。
 * 保持默认行为，只开启严格模式，以便在开发时暴露副作用未清理的问题。
 */
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
};

export default config;
