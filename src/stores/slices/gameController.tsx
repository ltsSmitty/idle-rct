import { useEffect, useRef, useState } from "react";
import actions from "~/stores/slices/allStoreActions";

const TICK_LENGTH_MS = 400;

export const GameController = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(true);

  // Kick off a render-loop which mutates all state objects/each frame
  useEffect(() => {
    let lastCalledTime = Date.now();
    const timer = requestAnimationFrame(function renderLoop() {
      const interval = Date.now() - lastCalledTime;

      if (interval > TICK_LENGTH_MS && !isPaused) {
        ref.current ? (ref.current.innerText = `${interval}`) : null;
        lastCalledTime = Date.now();
        actions.doTick();
      }
      requestAnimationFrame(renderLoop);
    });
  }, [isPaused]);

  return (
    <div>
      <div ref={ref} />
      <button className="" onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "▶️" : "⏸️"}
      </button>
    </div>
  );
};

/** Experimental component for displaying FPS. Is currently causing 2x ticks */
export const FPSMonitor = () => {
  const FPSref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let lastCalledTime = Date.now();
    let fps = 0;
    const renderLoop = () => {
      const delta = (Date.now() - lastCalledTime) / 1000;
      lastCalledTime = Date.now();
      fps = 1 / delta;
      FPSref.current
        ? (FPSref.current.innerText = "fps " + fps.toFixed())
        : null;
      requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }, []);
  return <div ref={FPSref} className="" />;
};
