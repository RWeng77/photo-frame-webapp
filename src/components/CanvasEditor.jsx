import { useRef, useEffect, useState } from "react";

export default function CanvasEditor({ image, frame, onResetImage, onResetFrame }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const frm = new Image();

    const drawCanvas = () => {
      frm.onload = () => {
        canvas.width = frm.width;
        canvas.height = frm.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const frameAspect = frm.width / frm.height;
        const imageAspect = img.width / img.height;
        let drawWidth, drawHeight;

        if (imageAspect > frameAspect) {
          drawWidth = frm.width * scale;
          drawHeight = (frm.width / imageAspect) * scale;
        } else {
          drawHeight = frm.height * scale;
          drawWidth = (frm.height * imageAspect) * scale;
        }

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        ctx.drawImage(frm, 0, 0, canvas.width, canvas.height);
      };
      frm.src = frame;
    };

    img.onload = drawCanvas;
    img.src = image;
  }, [image, frame, scale, rotation]);

  const download = () => {
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "framed_image.png";
    a.click();
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="overflow-auto">
        <canvas
          ref={canvasRef}
          className="border my-4 mx-auto max-w-full"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">縮放：</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.01"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-full"
        />

        <label className="text-sm mt-2">旋轉角度（度）：</label>
        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex justify-center flex-wrap gap-3 mt-4">
        <button
          onClick={download}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          下載圖片
        </button>
        <button
          onClick={onResetImage}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-full"
        >
          重新上傳圖片
        </button>
        <button
          onClick={onResetFrame}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-full"
        >
          更換相框
        </button>
      </div>
    </div>
  );
}

