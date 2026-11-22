export interface WorkspaceSettingsState {
  region: string;
  releaseAlert: boolean;
  auditAlert: boolean;
}

export interface SettingsBlockProps {
  /** 保存回调 */
  onSave?: (state: WorkspaceSettingsState) => void;
  /** 自定义容器类名 */
  className?: string;
}
