/**
 * AnimatedFileUpload 文件格式化、校验与预览链接辅助函数。
 */

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const matchesRule = (file: File, rule: string): boolean => {
  const token = rule.trim().toLowerCase();
  if (!token || token === "*/*") return true;
  if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token);
  if (token.endsWith("/*")) return file.type.toLowerCase().startsWith(token.slice(0, -1));
  return file.type.toLowerCase() === token;
};

export const matchesAccept = (file: File, accept?: string): boolean => {
  if (!accept) return true;
  return accept.split(",").some((rule) => matchesRule(file, rule));
};

export const createPreviewUrl = (file: File): string | undefined => {
  if (!file.type.startsWith("image/") || typeof URL.createObjectURL !== "function")
    return undefined;
  return URL.createObjectURL(file);
};

export const revokePreviewUrl = (url?: string) => {
  if (url && typeof URL.revokeObjectURL === "function") URL.revokeObjectURL(url);
};

export const validateFiles = (
  incoming: File[],
  existingCount: number,
  options: { accept?: string; maxSize?: number; maxFiles?: number },
): { accepted: File[]; errors: string[] } => {
  const accepted: File[] = [];
  const errors: string[] = [];

  for (const file of incoming) {
    if (!matchesAccept(file, options.accept)) {
      errors.push(`${file.name} 类型不受支持`);
    } else if (options.maxSize !== undefined && file.size > options.maxSize) {
      errors.push(`${file.name} 超过 ${formatFileSize(options.maxSize)} 限制`);
    } else if (
      options.maxFiles !== undefined &&
      existingCount + accepted.length >= options.maxFiles
    ) {
      errors.push(`最多只能上传 ${options.maxFiles} 个文件`);
    } else {
      accepted.push(file);
    }
  }

  return { accepted, errors };
};
