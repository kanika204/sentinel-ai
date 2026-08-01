import { useRef } from "react";

function useLongPress(onFinish, delay = 3000) {
  const timerRef = useRef(null);

  const start = () => {
    timerRef.current = setTimeout(() => {
      onFinish();
    }, delay);
  };

  const cancel = () => {
    clearTimeout(timerRef.current);
  };

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,

    onTouchStart: start,
    onTouchEnd: cancel,
  };
}

export default useLongPress;