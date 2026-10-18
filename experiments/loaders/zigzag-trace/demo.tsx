import { ZigzagTrace, type ZigzagTraceProps } from "./component";

const VARIANTS: { name: string; props: ZigzagTraceProps }[] = [
  { name: "Default", props: {} },
  {
    name: "Teal",
    props: {
      colors: {
        track: "#d5f3ef",
        boltLight: "#4fd1c5",
        boltDark: "#0f9488",
        metal: ["#053a37", "#7fe3da", "#0b5f59", "#032624", "#5cd0c6", "#0a4743"],
        shadow: "#053a37",
        frame: "rgb(15 148 136 / 0.12)",
      },
    },
  },
  {
    name: "Slow, no frame",
    props: { duration: 5, repeatDelay: 1, pulse: false, size: 72 },
  },
  {
    name: "Large",
    props: { size: 120, colors: { frame: "rgb(244 114 182 / 0.14)" } },
  },
];

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {VARIANTS.map(({ name, props }) => (
        <figure key={name} className="m-0">
          <div className="h-40 w-40 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <ZigzagTrace {...props} />
          </div>
          <figcaption className="mt-1 text-center text-xs text-zinc-500">
            {name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
