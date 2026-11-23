/**
 * AiImageReveal 粒子马赛克物理与像素采样引擎：零外部依赖，基于 TypedArray 实现 60fps 聚拢降噪显影。
 */
export interface ParticleField {
  readonly count: number;
  readonly cols: number;
  readonly rows: number;
  readonly cell: number;
  stepIdle: (dt: number, t: number) => void;
  setTargets: (rgb: ArrayLike<number> | null) => void;
  draw: (out: Uint32Array, t: number, elapsed: number | null, duration: number) => boolean;
}

const TAU = Math.PI * 2;
const clampVal = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);
const easeCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);

const createPrng = (initialSeed: number) => {
  let seed = initialSeed;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const parseHexRgb = (hex: string): [number, number, number] => {
  const n = Number.parseInt(hex.replace("#", "").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const packRgba = (r: number, g: number, b: number, a: number) =>
  ((a & 255) << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255);

const paintBlock = (
  out: Uint32Array,
  w: number,
  h: number,
  x: number,
  y: number,
  s: number,
  color: number,
) => {
  const ps = s < 1.5 ? 1 : Math.round(s);
  const x0 = Math.round(x - ps / 2);
  const y0 = Math.round(y - ps / 2);
  const xa = Math.max(0, x0);
  const ya = Math.max(0, y0);
  const xb = Math.min(w, x0 + ps);
  const yb = Math.min(h, y0 + ps);
  for (let yy = ya; yy < yb; yy++) {
    const row = yy * w;
    for (let xx = xa; xx < xb; xx++) out[row + xx] = color;
  }
};

interface FieldBuffers {
  px: Float32Array;
  py: Float32Array;
  sx: Float32Array;
  sy: Float32Array;
  tx: Float32Array;
  ty: Float32Array;
  delay: Float32Array;
  arc: Float32Array;
  nz: Float32Array;
  ph: Float32Array;
  size: Float32Array;
  ir: Uint8Array;
  ig: Uint8Array;
  ib: Uint8Array;
  tr: Uint8Array;
  tg: Uint8Array;
  tb: Uint8Array;
  perm: Uint32Array;
}

const allocateBuffers = (n: number): FieldBuffers => ({
  px: new Float32Array(n),
  py: new Float32Array(n),
  sx: new Float32Array(n),
  sy: new Float32Array(n),
  tx: new Float32Array(n),
  ty: new Float32Array(n),
  delay: new Float32Array(n),
  arc: new Float32Array(n),
  nz: new Float32Array(n),
  ph: new Float32Array(n),
  size: new Float32Array(n),
  ir: new Uint8Array(n),
  ig: new Uint8Array(n),
  ib: new Uint8Array(n),
  tr: new Uint8Array(n),
  tg: new Uint8Array(n),
  tb: new Uint8Array(n),
  perm: new Uint32Array(n),
});

const initBuffers = (
  n: number,
  w: number,
  h: number,
  palette: [number, number, number][],
  rnd: () => number,
): FieldBuffers => {
  const b = allocateBuffers(n);
  const sigma = Math.min(w, h) * 0.2;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.min(0.9999, rnd()))) * Math.cos(TAU * rnd());
  for (let i = 0; i < n; i++) {
    b.perm[i] = i;
    b.px[i] = w / 2 + gauss() * sigma * 1.15;
    b.py[i] = h / 2 + gauss() * sigma;
    b.ph[i] = rnd() * TAU;
    b.size[i] = 1 + rnd() * 1.6;
    b.delay[i] = rnd();
    b.arc[i] = rnd() * 2 - 1;
    b.nz[i] = rnd() * 2 - 1;
    const c = palette[Math.floor(rnd() * palette.length)]!;
    b.ir[i] = c[0];
    b.ig[i] = c[1];
    b.ib[i] = c[2];
  }
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = b.perm[i]!;
    b.perm[i] = b.perm[j]!;
    b.perm[j] = tmp;
  }
  return b;
};

const lerpByte = (a: number, bVal: number, e: number, noise: number) =>
  clampVal(a + (bVal - a) * e + noise, 0, 255) | 0;

const paintSingleGather = (
  b: FieldBuffers,
  out: Uint32Array,
  i: number,
  u: number,
  dims: { w: number; h: number; cell: number },
) => {
  const e = easeCubic(u);
  const dx = b.tx[i]! - b.sx[i]!;
  const dy = b.ty[i]! - b.sy[i]!;
  const len = Math.hypot(dx, dy) || 1;
  const bow = b.arc[i]! * Math.sin(Math.PI * e) * len * 0.2;
  const x = e >= 1 ? b.tx[i]! : b.sx[i]! + dx * e + (-dy / len) * bow;
  const y = e >= 1 ? b.ty[i]! : b.sy[i]! + dy * e + (dx / len) * bow;
  const s = b.size[i]! + (dims.cell - b.size[i]!) * e * e;
  const noise = b.nz[i]! * 76 * (1 - e);
  const color = packRgba(
    lerpByte(b.ir[i]!, b.tr[i]!, e, noise),
    lerpByte(b.ig[i]!, b.tg[i]!, e, noise),
    lerpByte(b.ib[i]!, b.tb[i]!, e, noise),
    150 + 105 * e,
  );
  paintBlock(out, dims.w, dims.h, x, y, s, color);
};

const drawGatherParticles = (
  b: FieldBuffers,
  out: Uint32Array,
  opts: { n: number; w: number; h: number; cell: number; elapsed: number; duration: number },
) => {
  const travel = Math.max(0.01, opts.duration * 0.72);
  const maxDelay = opts.duration * 0.28;
  let done = true;
  for (let i = 0; i < opts.n; i++) {
    const u = clampVal((opts.elapsed - b.delay[i]! * maxDelay) / travel, 0, 1);
    if (u < 1) done = false;
    paintSingleGather(b, out, i, u, opts);
  }
  return done;
};

const stepIdleBuffer = (
  b: FieldBuffers,
  n: number,
  cx: number,
  cy: number,
  dt: number,
  t: number,
) => {
  for (let i = 0; i < n; i++) {
    const dx = b.px[i]! - cx;
    const dy = b.py[i]! - cy;
    const ph = b.ph[i]!;
    b.px[i] =
      b.px[i]! + (-dy * 0.16 + Math.sin(b.py[i]! * 0.021 + t * 0.55 + ph) * 28 - dx * 0.2) * dt;
    b.py[i] =
      b.py[i]! + (dx * 0.16 + Math.cos(b.px[i]! * 0.018 - t * 0.47 + ph) * 28 - dy * 0.2) * dt;
  }
};

const assignBufferTargets = (
  b: FieldBuffers,
  opts: { n: number; cols: number; cell: number; palette: [number, number, number][] },
  rgb: ArrayLike<number> | null,
) => {
  for (let i = 0; i < opts.n; i++) {
    const c = b.perm[i]!;
    const col = c % opts.cols;
    const row = (c / opts.cols) | 0;
    b.tx[i] = (col + 0.5) * opts.cell;
    b.ty[i] = (row + 0.5) * opts.cell;
    b.sx[i] = b.px[i]!;
    b.sy[i] = b.py[i]!;
    const fb = opts.palette[(col + row) % opts.palette.length]!;
    b.tr[i] = rgb ? (rgb[c * 3] ?? fb[0]) : fb[0];
    b.tg[i] = rgb ? (rgb[c * 3 + 1] ?? fb[1]) : fb[1];
    b.tb[i] = rgb ? (rgb[c * 3 + 2] ?? fb[2]) : fb[2];
  }
};

const drawIdleBuffer = (
  b: FieldBuffers,
  out: Uint32Array,
  n: number,
  w: number,
  h: number,
  t: number,
) => {
  for (let i = 0; i < n; i++) {
    const tw = 0.5 + 0.5 * Math.sin(t * 1.4 + b.ph[i]! * 3);
    paintBlock(
      out,
      w,
      h,
      b.px[i]!,
      b.py[i]!,
      b.size[i]!,
      packRgba(b.ir[i]!, b.ig[i]!, b.ib[i]!, 90 + 150 * tw),
    );
  }
};

export const createParticleField = (opts: {
  width: number;
  height: number;
  cell: number;
  colors: string[];
  seed?: number;
}): ParticleField => {
  const { width: w, height: h, cell } = opts;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const n = cols * rows;
  const palette = (opts.colors.length ? opts.colors : ["#888888"]).map(parseHexRgb);
  const b = initBuffers(n, w, h, palette, createPrng(opts.seed ?? 7));

  return {
    count: n,
    cols,
    rows,
    cell,
    stepIdle: (dt, t) => stepIdleBuffer(b, n, w / 2, h / 2, dt, t),
    setTargets: (rgb) => assignBufferTargets(b, { n, cols, cell, palette }, rgb),
    draw(out, t, elapsed, duration) {
      out.fill(0);
      if (elapsed === null) {
        drawIdleBuffer(b, out, n, w, h, t);
        return false;
      }
      return drawGatherParticles(b, out, { n, w, h, cell, elapsed, duration });
    },
  };
};

const sampleSingleCell = (
  data: ArrayLike<number>,
  w: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  step: number,
): [number, number, number] => {
  let r = 0;
  let g = 0;
  let bl = 0;
  let count = 0;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const o = (y * w + x) * 4;
      r += data[o] ?? 0;
      g += data[o + 1] ?? 0;
      bl += data[o + 2] ?? 0;
      count++;
    }
  }
  const denom = count || 1;
  return [r / denom, g / denom, bl / denom];
};

/** 计算目标 RGBA 像素数组每个 cell×cell 网格的平均 RGB */
export const averageCells = (
  data: ArrayLike<number>,
  w: number,
  h: number,
  cell: number,
): Uint8Array => {
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const out = new Uint8Array(cols * rows * 3);
  const step = Math.max(1, Math.floor(cell / 4));
  for (let cy = 0; cy < rows; cy++) {
    const y0 = cy * cell;
    const y1 = Math.min(h, y0 + cell);
    for (let cx = 0; cx < cols; cx++) {
      const x0 = cx * cell;
      const [r, g, bl] = sampleSingleCell(data, w, x0, y0, Math.min(w, x0 + cell), y1, step);
      const k = (cy * cols + cx) * 3;
      out[k] = r;
      out[k + 1] = g;
      out[k + 2] = bl;
    }
  }
  return out;
};
