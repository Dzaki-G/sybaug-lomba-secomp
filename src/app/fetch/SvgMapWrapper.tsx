"use client";

import dynamic from "next/dynamic";

const SvgMap = dynamic(() => import("./svg/page"), {
  ssr: false,
});

export default function SvgMapWrapper() {
  return <SvgMap />;
}
