// components/FrameSelector.jsx
export default function FrameSelector({ setFrame }) {
  const frames = [
    "frames/frame1.png",
    "frames/frame2.png",
    "frames/frame3.png",
    "frames/frame4.png",
    "frames/frame5.png",
    "frames/frame6.png",
  ];

  return (
    <div className="grid grid-cols-2 gap-4 justify-items-center">
      {frames.map((src, index) => (
        <button
          key={index}
          onClick={() => setFrame(src)}
          style={{ backgroundColor: "#9b8659" }}
          className="relative w-36 h-36 border-4 border-white rounded overflow-hidden shadow-lg"
        >
          <img
            src={src}
            alt={`相框 ${index + 1}`}
            className="object-contain w-full h-full"
          />
        </button>
      ))}
    </div>
  );
}

