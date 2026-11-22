/**
 * 机械键盘按键音合成器：基于 Web Audio API 合成极短的滤波脉冲，不依赖外部音频文件。
 * 浏览器不支持 AudioContext 或自动播放受限时静默跳过。
 */

interface KeySoundPlayer {
  /** 在用户手势回调中预热并恢复音频上下文，满足浏览器自动播放策略 */
  unlock: () => void;
  /** 触发一次按键音 */
  play: () => void;
  /** 释放音频上下文 */
  close: () => void;
}

const getAudioContextConstructor = (): typeof AudioContext | undefined => {
  if (typeof globalThis === "undefined") return undefined;
  const host = globalThis as typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };
  return host.AudioContext ?? host.webkitAudioContext;
};

/** 合成一次清脆的指数衰减滤波噪声脉冲 */
const playClick = (ctx: AudioContext) => {
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  const duration = 0.016;
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleCount * 0.28));
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  // 轻微频偏让连续打字更自然，避免听感僵硬
  filter.frequency.value = 1900 + Math.random() * 650;
  filter.Q.value = 1.6;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration);
};

export const createKeySound = (): KeySoundPlayer => {
  let context: AudioContext | null = null;

  const ensureContext = (): AudioContext | null => {
    if (context) return context;
    const AudioCtx = getAudioContextConstructor();
    if (!AudioCtx) return null;
    try {
      context = new AudioCtx();
    } catch {
      return null;
    }
    return context;
  };

  return {
    unlock: () => {
      const ctx = ensureContext();
      if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => {});
    },
    play: () => {
      const ctx = ensureContext();
      if (!ctx) return;
      try {
        playClick(ctx);
      } catch {
        // 忽略自动播放限制或已关闭的音频上下文
      }
    },
    close: () => {
      if (!context) return;
      const target = context;
      context = null;
      try {
        void target.close().catch(() => {});
      } catch {
        // 忽略关闭异常
      }
    },
  };
};
