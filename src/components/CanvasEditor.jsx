import { useRef, useEffect, useState } from "react";

export default function CanvasEditor({ image, frame }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const frm = new Image();

    img.onload = () => {
      canvas.width = 500;
      canvas.height = 500;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const imgW = img.width * scale;
      const imgH = img.height * scale;
      const offsetX = (canvas.width - imgW) / 2;
      const offsetY = (canvas.height - imgH) / 2;
      ctx.drawImage(img, offsetX, offsetY, imgW, imgH);
      frm.onload = () => ctx.drawImage(frm, 0, 0, canvas.width, canvas.height);
      frm.src = frame;
    };
    img.src = image;
  }, [image, frame, scale]);

  const download = () => {
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "framed_image.png";
    a.click();
  };

  return (
    <div>
      <canvas ref={canvasRef} className="border my-4" />
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.01"
        value={scale}
        onChange={(e) => setScale(parseFloat(e.target.value))}
        className="w-full"
      />
      <button onClick={download} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        下載圖片
      </button>
    </div>
  );
}

