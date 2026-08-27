import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#030704", border: "4px solid #75ff70", color: "#75ff70", fontSize: 30, fontWeight: 800, fontFamily: "monospace" }}>M</div>,
    size,
  );
}
