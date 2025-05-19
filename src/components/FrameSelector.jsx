export default function FrameSelector({ setFrame }) {
  const frames = ["/frames/frame1.png", "/frames/frame2.png"];

  return (
    <div className="flex space-x-4">
      {frames.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Frame ${idx + 1}`}
          className="w-24 h-24 border cursor-pointer hover:scale-110 transition"
          onClick={() => setFrame(url)}
        />
      ))}
    </div>
  );
}

