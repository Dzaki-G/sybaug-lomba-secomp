"use client";

import { CSSProperties, useEffect, useState } from "react";
import localFont from "next/font/local";

const technologyFont = localFont({
  src: [
    { path: "../../../public/fonts/technology/Technology.ttf", weight: "400", style: "normal" },
    { path: "../../../public/fonts/technology/Technology-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../../public/fonts/technology/Technology-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../../public/fonts/technology/Technology-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-technology",
});

export default function Header() {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wib = new Date(utc + 7 * 60 * 60 * 1000);

      const timeString = wib
        .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        .replace(/\./g, ":");

      setTime(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header style={headerStyle} className={technologyFont.variable} suppressHydrationWarning>
      <div style={headerContainerStyle}>
        <div style={leftSectionStyle}>
          <img src="/img/Lampung_coa.png" alt="Logo" style={logoStyle} />
          <div style={dividerStyle} />
          <img src="/img/bpbd.png" alt="Logo" style={logoStyle} />
          <span style={textStyle}>
            Badan Penanggulangan Bencana Daerah <br />
            Provinsi Lampung
          </span>
        </div>
        {/* Jam Digital */}
        <div style={clockStyle}>{time} WIB</div>
      </div>
    </header>
  );
}

const headerStyle: CSSProperties = {
  width: "100%",
  background: "rgba(255, 255, 255, 0)",
  color: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 24px",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const headerContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: "1134px",
  margin: "0 auto",
  padding: "0 24px",
};

const leftSectionStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logoStyle: CSSProperties = { height: "50px", objectFit: "contain" };

const dividerStyle: CSSProperties = {
  width: "2px",
  height: "45px",
  backgroundColor: "#ffffff",
  marginLeft: "12px",
  opacity: 0.7,
};

const textStyle: CSSProperties = { fontWeight: "bold", fontSize: "16px", color: "white" };

const clockStyle: CSSProperties = {
  fontFamily: "var(--font-technology), sans-serif",
  fontSize: "32px",
  letterSpacing: "5px",
  minWidth: "120px",
  textAlign: "center",
  fontWeight: "bold",
};
