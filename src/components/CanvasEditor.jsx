import { useRef, useEffect, useState } from "react";

export default function CanvasEditor({ image, frame, isIphone, onResetImage, onResetFrame }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState(null);
  const [initialRotation, setInitialRotation] = useState(null);
  const [frameImage, setFrameImage] = useState(null);
  const [quality, setQuality] = useState(0.92);

  useEffect(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [image]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const frm = new Image();

    frm.onload = () => {
      setFrameImage(frm);
    };
    frm.src = frame;

    img.onload = () => {
      if (!frameImage) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
      ctx.rotate((rotation * Math.PI) / 180);

      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    };
    img.src = image;
  }, [image, frameImage, scale, rotation, position]);

  const getCanvasPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (e.touches && e.touches.length === 2) {
      const dist = getTouchDistance(e.touches);
      setTouchDistance(dist);
      setInitialRotation(getTouchAngle(e.touches));
    } else {
      setDragging(true);
      const pos = getCanvasPos(e);
      const canvas = canvasRef.current;
      setOffset({
        x: pos.x - canvas.width / 2 - position.x,
        y: pos.y - canvas.height / 2 - position.y,
      });
    }
  };

  const handleMove = (e) => {
    if (e.touches && e.touches.length === 2) {
      const newDist = getTouchDistance(e.touches);
      const newAngle = getTouchAngle(e.touches);

      if (touchDistance !== null && initialRotation !== null) {
        const scaleChange = newDist / touchDistance;
        setScale((prevScale) => Math.min(2, Math.max(0.5, prevScale * scaleChange)));

        const rotationChange = newAngle - initialRotation;
        setRotation((prevRotation) => prevRotation + rotationChange);
        setInitialRotation(newAngle);
      }

      setTouchDistance(newDist);
    } else if (dragging) {
      const pos = getCanvasPos(e);
      const canvas = canvasRef.current;
      setPosition({
        x: pos.x - canvas.width / 2 - offset.x,
        y: pos.y - canvas.height / 2 - offset.y,
      });
    }
  };

  const handleEnd = () => {
    setDragging(false);
    setTouchDistance(null);
    setInitialRotation(null);
  };

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchAngle = (touches) => {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const download = () => {
    const url = canvasRef.current.toDataURL("image/jpeg", quality);
    if (isIphone) {
      const imgWindow = window.open();
      imgWindow.document.write(`<img src="${url}" style="width:100%" />`);
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = "framed_image.jpeg";
      a.click();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="overflow-auto">
        <canvas
          ref={canvasRef}
          className="border my-4 mx-auto max-w-full"
          style={{ width: "80%", height: "80%", touchAction: "none" }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">旋轉角度（度）：</label>
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

      <div className="flex flex-col gap-2 mt-2">
        <label className="text-sm">圖片壓縮程度：</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex justify-center flex-wrap gap-3 mt-4">
        <button
          onClick={download}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          {isIphone ? "開啟圖片儲存" : "下載圖片"}
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

