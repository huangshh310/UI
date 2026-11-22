/**
 * 逐字显示的状态逻辑：记录当前显示到第几个字符，按固定间隔推进，并在需要时播放按键音。
 */
import { useEffect, useRef, useState } from "react";
import { createKeySound } from "./key-sound.js";

interface TypewriterOptions {
  label: string;
  charDuration: number;
  autoStart: boolean;
  sound: boolean;
  onComplete?: (() => void) | undefined;
}

/** 管理按键音效播放器的生命周期，卸载或关闭音效时释放音频上下文 */
const useKeySoundPlayer = (enabled: boolean) => {
  const enabledRef = useRef(enabled);
  const playerRef = useRef<ReturnType<typeof createKeySound> | null>(null);

  useEffect(() => {
    enabledRef.current = enabled;
    if (!enabled && playerRef.current) {
      playerRef.current.close();
      playerRef.current = null;
    }
  });

  useEffect(
    () => () => {
      playerRef.current?.close();
      playerRef.current = null;
    },
    [],
  );

  const unlock = () => {
    if (!enabledRef.current) return;
    playerRef.current ??= createKeySound();
    playerRef.current.unlock();
  };

  const playIfVisible = (char: string | undefined) => {
    if (!enabledRef.current || !char || /\s/.test(char)) return;
    playerRef.current ??= createKeySound();
    playerRef.current.play();
  };

  return { unlock, playIfVisible };
};

export const useTypewriter = ({
  label,
  charDuration,
  autoStart,
  sound,
  onComplete,
}: TypewriterOptions) => {
  const [visible, setVisible] = useState(autoStart ? 0 : label.length);
  const [run, setRun] = useState(autoStart ? 1 : 0);
  const [typing, setTyping] = useState(autoStart);
  const onCompleteRef = useRef(onComplete);
  const soundPlayer = useKeySoundPlayer(sound);
  const playCharRef = useRef(soundPlayer.playIfVisible);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    playCharRef.current = soundPlayer.playIfVisible;
  });

  useEffect(() => {
    if (run === 0) return undefined;
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      playCharRef.current(label[count - 1]);
      setVisible(count);
      if (count >= label.length) {
        clearInterval(timer);
        setTyping(false);
        onCompleteRef.current?.();
      }
    }, charDuration);
    return () => clearInterval(timer);
  }, [run, label, charDuration]);

  const start = () => {
    soundPlayer.unlock();
    setVisible(0);
    setTyping(true);
    setRun((current) => current + 1);
  };

  return { text: label.slice(0, visible), typing, start };
};
