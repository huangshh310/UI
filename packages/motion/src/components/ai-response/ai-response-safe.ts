/**
 * AiResponse 安全链接过滤与剪贴板辅助工具。
 * 严格白名单过滤协议，杜绝 Markdown 链接中的 XSS 风险。
 */

const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

const hasControlChars = (value: string) => {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 31 || code === 127) return true;
  }
  return false;
};

const isRelativeHref = (value: string) =>
  value.startsWith("#") ||
  (value.startsWith("/") && !value.startsWith("//")) ||
  value.startsWith("./") ||
  value.startsWith("../");

/** 校验并净化 Markdown 链接地址，仅允许 http/https/mailto、页内锚点与站内相对路径 */
export const safeHref = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed || hasControlChars(trimmed)) return null;
  if (isRelativeHref(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return null;
    if (parsed.username || parsed.password) return null;
    return parsed.href;
  } catch {
    return null;
  }
};

export const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export const hostOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
};

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 降级到临时文本域复制
    }
  }
  if (typeof document === "undefined") return false;
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
};
