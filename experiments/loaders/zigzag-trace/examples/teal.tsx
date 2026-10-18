import { ZigzagTrace } from "../component";

export default function Example() {
  return (
    <div style={{ width: 240, height: 240, borderRadius: 16 }}>
      <ZigzagTrace
        colors={{
          track: "#d5f3ef",
          boltLight: "#4fd1c5",
          boltDark: "#0f9488",
          metal: ["#053a37", "#7fe3da", "#0b5f59", "#032624", "#5cd0c6", "#0a4743"],
          shadow: "#053a37",
          frame: "rgb(15 148 136 / 0.12)",
        }}
      />
    </div>
  );
}
