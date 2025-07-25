"use client";

import { useEffect, useState, CSSProperties } from "react";

export default function Clock() {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wib = new Date(utc + 7 * 60 * 60 * 1000);

      const timeString = wib
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/\./g, ":");

      setTime(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div style={clockStyle}>{time} WIB</div>;
}

const clockStyle: CSSProperties = {
  fontFamily: "var(--font-technology), sans-serif",
  letterSpacing: "2px",
  minWidth: "120px",
  textAlign: "center",
  fontWeight: "bold",
  color: "white",
};
