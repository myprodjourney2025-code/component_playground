import { ZigzagTrace } from "../component";

export default function Example() {
  return (
    <div style={{ width: 240, height: 240, borderRadius: 16 }}>
      <ZigzagTrace duration={5} repeatDelay={1} pulse={false} size={72} />
    </div>
  );
}
