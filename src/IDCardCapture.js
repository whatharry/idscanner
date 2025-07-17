import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import jsPDF from "jspdf";

const IDCardCapture = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current.getScreenshot();
    const img = new Image();
    img.src = screenshot;

    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const [r, g, b] = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];
        if (r > 180 && g > 180 && b > 180) {
          imageData.data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const cleaned = canvas.toDataURL("image/png");
      setImage(cleaned);
    };
  }, []);

  const saveAsPDF = () => {
    const doc = new jsPDF();
    doc.addImage(image, "PNG", 10, 10, 180, 100);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    doc.save("id-card.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <canvas ref={canvasRef} className="hidden" />
      
      {!image ? (
        <div className="relative w-full max-w-xs aspect-[3/2] rounded-xl overflow-hidden">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "environment" }}
          />
          <div className="absolute border-4 border-white rounded-md pointer-events-none inset-8" />
        </div>
      ) : (
        <img src={image} alt="Captured ID" className="rounded-xl w-full max-w-xs" />
      )}

      <div className="mt-6 space-x-4">
        {!image ? (
          <button
            onClick={capture}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
          >
            Capture
          </button>
        ) : (
          <>
            <button
              onClick={() => setImage(null)}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
            >
              Retake
            </button>
            <button
              onClick={saveAsPDF}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
            >
              Save as PDF
            </button>
          </>
        )}
      </div>

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          className="w-full max-w-xl h-[400px] mt-6 border rounded"
        />
      )}
    </div>
  );
};

export default IDCardCapture;
