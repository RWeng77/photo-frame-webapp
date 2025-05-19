// App.jsx
import { useState } from "react";
import FrameSelector from "./components/FrameSelector";
import CanvasEditor from "./components/CanvasEditor";

export default function App() {
  const [image, setImage] = useState(null);
  const [frame, setFrame] = useState("/frames/frame1.png");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">照片加相框工具</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <FrameSelector setFrame={setFrame} />
      {image && <CanvasEditor image={image} frame={frame} />}
    </div>
  );
}

