import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: "64px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "#14b8a6",
              display: "flex",
            }}
          />
          <span
            style={{
              color: "#ccfbf1",
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            TPT Flow
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#f0fdfa",
            fontSize: "64px",
            fontWeight: "800",
            lineHeight: "1.1",
            letterSpacing: "-2px",
            maxWidth: "820px",
            marginBottom: "24px",
          }}
        >
          Money that must move.
        </div>

        {/* Sub-headline */}
        <div
          style={{
            color: "#99f6e4",
            fontSize: "28px",
            fontWeight: "400",
            maxWidth: "700px",
            lineHeight: "1.4",
          }}
        >
          A programmable complementary currency with built-in demurrage and
          accumulation limits.
        </div>

        {/* Bottom rule */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "6px",
            background: "linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
