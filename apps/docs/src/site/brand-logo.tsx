/**
 * 站点品牌标志：浅色与深色主题分别加载对应配色图标，避免水合闪烁。
 */
export const BrandLogo = ({ className = "size-7" }: { className?: string }) => (
  <span aria-hidden="true" className={`relative inline-flex shrink-0 ${className}`}>
    <img
      src="/icons/light.svg"
      alt=""
      width={28}
      height={28}
      className="size-full object-contain dark:hidden"
    />
    <img
      src="/icons/dark.svg"
      alt=""
      width={28}
      height={28}
      className="hidden size-full object-contain dark:block"
    />
  </span>
);
