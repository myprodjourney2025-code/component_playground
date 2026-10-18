import { ZigzagTrace } from "../component";

export default function Example() {
  return (
    <div style={{ width: 240, height: 240, borderRadius: 16 }}>
      <ZigzagTrace size={140} colors={{ frame: "rgb(244 114 182 / 0.14)" }} />
    </div>
  );
}
