// App.jsx
import { useState } from "react";
import FrameSelector from "./components/FrameSelector";

export default function App() {
  const [image, setImage] = useState(null);
  const [frame, setFrame] = useState("/frames/frame1.png");
  const [showFrames, setShowFrames] = useState(false);
  const [frameSelected, setFrameSelected] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFrame = () => {
    setShowFrames(true);
  };

  const handleFrameChosen = (selectedFrame) => {
    setFrame(selectedFrame);
    setFrameSelected(true);
  };

  return (
      <div
        className="flex flex-col items-center justify-start text-center text-white w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/background/background1.png')" }}
      >

      <div className="p-4 space-y-4 text-center text-white min-h-screen max-w-md mx-auto">
        <h1 className="text-lg font-bold leading-snug">113級學生社團組織正副負責人 領證暨交接典禮</h1>
        <h2 className="text-4xl font-bold text-yellow-400 tracking-widest">光苒</h2>
        <p className="text-base">FCU 113</p>

        <div className="pt-4">
          {!showFrames && !frameSelected && (
            <button
              onClick={handleSelectFrame}
              className="bg-yellow-800 text-white px-6 py-3 rounded-full text-sm"
            >
              選擇相框
            </button>
          )}
        </div>

        {showFrames && !frameSelected && (
          <FrameSelector setFrame={handleFrameChosen} />
        )}

        {frameSelected && (
          <div className="space-y-4">
            <div className="relative w-full h-[400px] flex justify-center items-center bg-[#9b8659] rounded-md overflow-hidden">
              {image && (
                <img
                  src={image}
                  alt="上傳圖片預覽"
                  className="absolute object-contain max-h-full max-w-full z-0"
                />
              )}
              <img
                src={frame}
                alt="選擇的相框預覽"
                className="object-contain max-h-full max-w-full z-10 border border-yellow-500 shadow-lg"
              />
              <div className="absolute bottom-2 right-2 animate-bounce text-yellow-100 text-sm z-20">預覽中</div>
            </div>

            {!image && (
              <label className="bg-yellow-800 text-white px-6 py-3 rounded-full text-sm cursor-pointer inline-block">
                上傳照片
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

