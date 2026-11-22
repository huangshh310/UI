/**
 * 首页的色彩一节：说明配色取向，并展示直接取自 Token 的色块。
 */
import { PaletteStrip } from "./palette-strip";

export const PaletteSection = () => (
  <section aria-labelledby="palette-title" className="border-t border-border py-20">
    <h2 id="palette-title" className="max-w-xl text-3xl font-semibold tracking-tight">
      九成是中性色，剩下的交给信号色
    </h2>
    <p className="mt-4 mb-10 max-w-xl leading-relaxed text-muted-foreground">
      下面的色块直接取自设计 Token。用右上角的按钮切换主题，中性色整体翻转，信号色保持不变。
    </p>
    <PaletteStrip />
  </section>
);
