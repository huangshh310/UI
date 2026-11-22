/**
 * Button 加载状态下显示的旋转指示器。仅供 Button 内部使用，不对外导出。
 *
 * 纯装饰：对辅助技术隐藏，忙碌状态由按钮自身的 aria-busy 表达。
 * 用户要求减少动态效果时停止旋转，静止的缺口圆环仍能表示「进行中」。
 */
export const ButtonSpinner = () => (
  <svg
    aria-hidden="true"
    data-slot="button-spinner"
    className="animate-spin motion-reduce:animate-none"
    viewBox="0 0 16 16"
    fill="none"
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
