import type { HTMLAttributes } from "react";

export type AiImageRevealPhase = "idle" | "gather" | "refine" | "done" | "error";

export interface AiImageRevealHandle {
  /** 重新播放当前图像的粒子聚拢与降噪显影序列 */
  replay: () => void;
}

export interface AiImageRevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** 生成完成的目标图片地址；留空时保持粒子云等待态 */
  src?: string | null;
  /** 图片替代描述文本 */
  alt: string;
  /** 强制处于生成等待态（默认在 src 为空时自动等待） */
  generating?: boolean;
  /** 画幅宽高比（宽 / 高），默认 1（正方形） */
  aspectRatio?: number;
  /** 展示在画幅下方的提示词说明 */
  prompt?: string;
  /** 等待态状态胶囊文案（默认「正在生成图像…」） */
  generatingLabel?: string;
  /** 等待态粒子云调色板（#rrggbb 数组），留空时自动匹配当前明暗主题 */
  colors?: string[];
  /** 粒子密度倍率（0.4 – 2），越大马赛克越精细，默认 1 */
  density?: number;
  /** 完整粒子聚拢至高清显影时长（秒），默认 2.8 */
  duration?: number;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  onReveal?: () => void;
  onImageError?: () => void;
}
