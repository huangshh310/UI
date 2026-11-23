export type SettingsBlockVariant = "default" | "elevated" | "sectioned";

export interface WorkspaceSettingsState {
  region: string;
  releaseAlert: boolean;
  auditAlert: boolean;
}

export interface SettingsBlockProps {
  /** 面板视觉风格：标准发丝单卡、浮层阴影或分节卡片组 */
  variant?: SettingsBlockVariant;
  /** 面板标题 */
  title?: string;
  /** 面板副标题描述 */
  description?: string;
  /** 默认部署区域 */
  defaultRegion?: string;
  /** 默认发布状态告警开关 */
  defaultReleaseAlert?: boolean;
  /** 默认无障碍回归巡检开关 */
  defaultAuditAlert?: boolean;
  /** 紧凑密度模式 */
  compact?: boolean;
  /** 保存回调 */
  onSave?: (state: WorkspaceSettingsState) => void;
  /** 重置回调 */
  onReset?: () => void;
  /** 自定义容器类名 */
  className?: string;
}
