// src/hooks/useMessege.js
import { useState } from "react";

export function useMessage(timeout = 1500) {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("");

  const showMessage = (msg, t) => {
    setMessage(msg);
    setType(t);

    setTimeout(() => {
      setMessage(null);
      setType("");
    }, timeout);
  };

  return { message, type, showMessage };
}