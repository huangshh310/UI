/**
 * 逐字显示的状态逻辑：记录当前显示到第几个字符，按固定间隔推进。
 */
import { useEffect, useRef, useState } from "react";

interface TypewriterOptions {
  label: string;
  charDuration: number;
  autoStart: boolean;
  onComplete?: (() => void) | undefined;
}

export const useTypewriter = ({
  label,
  charDuration,
  autoStart,
  onComplete,
}: TypewriterOptions) => {
  // 可见的字符数；未开始打字时显示全部
  const [visible, setVisible] = useState(autoStart ? 0 : label.length);
  // 第几轮打字；0 表示还没有开始过。每次重新开始都加一，用来重启定时器
  const [run, setRun] = useState(autoStart ? 1 : 0);
  const [typing, setTyping] = useState(autoStart);
  // 用 ref 保存回调，回调变化不会打断正在进行的打字
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (run === 0) return undefined;
    // 一轮打字只用一个定时器，推进不依赖组件重新渲染
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= label.length) {
        clearInterval(timer);
        setTyping(false);
        onCompleteRef.current?.();
      }
    }, charDuration);
    // 组件卸载或重新开始时停掉定时器
    return () => clearInterval(timer);
  }, [run, label.length, charDuration]);

  /** 从头开始打字 */
  const start = () => {
    setVisible(0);
    setTyping(true);
    setRun((current) => current + 1);
  };

  return { text: label.slice(0, visible), typing, start };
};
