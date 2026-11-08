import Voice from "./examples/voice";

// The playground canvas shows the fullest example, centred. (The gallery
// examples are just the frame, so switching tabs never changes the stage.)
export default function Demo() {
  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Voice />
    </div>
  );
}
