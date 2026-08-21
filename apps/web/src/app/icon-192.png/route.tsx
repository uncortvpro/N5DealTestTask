import { ImageResponse } from "next/og";

export async function GET() {
  const size = 192;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#d3a24a",
          color: "#0a1220",
          fontSize: size * 0.5,
          fontWeight: 700,
        }}
      >
        N
      </div>
    ),
    { width: size, height: size }
  );
}
