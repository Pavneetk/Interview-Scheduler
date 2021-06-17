import { useState } from "react";

export default function useVisualMode(initial) {
 
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) { 
    setHistory(prev => {
      if (replace) {  
        const copy = [...prev];
        copy.splice(-1, 1, newMode);
        return copy;
      }

      return [...prev, newMode];
    });
  }

  function back() { 
    if (history.length < 2) return;
    setHistory(prev => [...prev.slice(0, history.length - 1)]);
    }

  const mode = history.slice(-1)[0];
  return { mode, transition, back };
};