/**
 * 测试环境补丁：jsdom 没有 matchMedia，motion 判断「减少动态效果」时需要它。
 * 这里固定返回「不匹配」，即用户没有要求减少动态效果。
 */
if (typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
