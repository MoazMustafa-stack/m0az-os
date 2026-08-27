import { ImageResponse } from "next/og";

export const alt = "M0AZ_OS — Moaz, software engineer and systems builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "54px", background: "#030704", color: "#b1ffad", fontFamily: "monospace", border: "2px solid #193b19" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, letterSpacing: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}><span style={{ display: "flex", width: 42, height: 42, alignItems: "center", justifyContent: "center", background: "#75ff70", color: "#030704", fontWeight: 900 }}>M</span>M0AZ_OS</div>
        <span style={{ color: "#487a47", fontSize: 16 }}>NET: ONLINE</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ color: "#75ff70", fontSize: 20, marginBottom: 24 }}>moaz@portfolio:~$ ./whoami</span>
        <div style={{ display: "flex", fontSize: 70, fontWeight: 800, letterSpacing: -5, lineHeight: 1.05 }}>I build systems people<br />can understand.</div>
        <span style={{ color: "#70a56e", fontSize: 22, marginTop: 28 }}>SOFTWARE ENGINEERING / SYSTEMS / PRODUCT / RESEARCH</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 18, borderTop: "1px solid #193b19", color: "#487a47", fontSize: 15 }}><span>portfolio-sh ready</span><span>build.2026</span></div>
    </div>,
    size,
  );
}
