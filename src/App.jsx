import { useState, useRef } from "react";
import FrameSelector from "./components/FrameSelector";
import CanvasEditor from "./components/CanvasEditor";

export default function App() {
  const [image, setImage] = useState(null);
  const [frame, setFrame] = useState("/frames/frame1.png");
  const [showFrames, setShowFrames] = useState(false);
  const [frameSelected, setFrameSelected] = useState(false);
  const [editingMode, setEditingMode] = useState(false);

  const fileInputRef = useRef();

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

  const isIphone = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const showInitialText = !showFrames && !frameSelected;
  const showFrameTitle = showFrames && !frameSelected;

  return (
    <div
      className="flex flex-col justify-between w-full min-h-screen bg-cover bg-center text-white transition-all duration-500"
      style={{
        backgroundImage: showFrames
          ? "url('/background/background2.jpg')"
          : "url('/background/background1.png')",
        fontFamily: "SimSun, '宋体', serif"
      }}
    >
      {/* 上方標題區塊 */}
      <div className="flex flex-col items-center justify-center pt-20 text-center space-y-4">
        {showInitialText && (
          <>
            <h1 className="text-2xl font-bold leading-snug">113級學生社團組織正副負責人</h1>
            <h1 className="text-2xl font-bold leading-snug">頒證暨交接典禮</h1>
          </>
        )}
        {showFrameTitle && <h1 className="text-2xl font-bold leading-snug">相框樣式</h1>}
      </div>

      {/* 中下功能區塊 */}
      <div className="flex flex-col items-center justify-center text-center pb-32 space-y-4 max-w-md mx-auto">
        {showInitialText && <p className="text-2xl pb-10">FCU 113</p>}

        {!showFrames && !frameSelected && (
          <button
            onClick={handleSelectFrame}
            style={{ backgroundColor: "#9b8659" }}
            className="text-white px-6 py-3 rounded-full text-2xl"
          >
            選擇相框
          </button>
        )}

        {showFrames && !frameSelected && <FrameSelector setFrame={handleFrameChosen} />}

        {/* 簡易預覽區塊 */}
        {frameSelected && !editingMode && (
          <>
            <div className="relative w-full max-w-md h-[400px] flex justify-center items-center bg-[#9b8659] rounded-md overflow-hidden">
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
                className="object-contain max-h-full max-w-full z-10 border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-2 right-2 animate-bounce text-yellow-100 text-sm z-20">
                預覽中
              </div>
            </div>

            {/* 上傳/重新上傳按鈕 */}
            {!image && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <label className="bg-yellow-800 text-white px-6 py-3 rounded-full text-sm cursor-pointer inline-block">
                  上傳照片
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>
                <button
                  onClick={() => {
                    setImage(null);
                    setFrameSelected(false);
                    setShowFrames(false);
                    setEditingMode(false);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  回到首頁
                </button>
              </div>
            )}

            {image && (
              <div className="flex flex-col items-center gap-2 mt-4">
                {isIphone && (
                  <p className="text-sm text-yellow-300">
                    注意：iPhone 用戶請點擊下方按鈕，然後長按圖片選擇「儲存圖片」
                  </p>
                )}
                <button
                  onClick={() => setEditingMode(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  編輯與下載
                </button>
                <button
                  onClick={() => {
                    setImage(null);
                    fileInputRef.current.click();
                  }}
                  className="bg-yellow-700 text-white px-4 py-2 rounded"
                >
                  重新上傳
                </button>
                <button
                  onClick={() => {
                    setImage(null);
                    setFrameSelected(false);
                    setShowFrames(false);
                    setEditingMode(false);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  回到首頁
                </button>
              </div>
            )}
          </>
        )}

        {/* 編輯模式 */}
        {editingMode && (
          <CanvasEditor
            image={image}
            frame={frame}
            isIphone={isIphone}
            onResetImage={() => {
              setImage(null);
              setEditingMode(false);
              fileInputRef.current.click();
            }}
            onResetFrame={() => {
              setFrameSelected(false);
              setShowFrames(true);
              setEditingMode(false);
            }}
          />
        )}

        {/* 隱藏的上傳 input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />
      </div>
    </div>
  );
}

