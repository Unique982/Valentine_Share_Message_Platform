
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  url: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#ec4899',
          light: '#ffffff',
        },
      });
    }
  }, [url]);

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'love-page-qr.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-4 bg-white rounded-3xl shadow-2xl">
        <canvas ref={canvasRef} />
      </div>
      <button 
        onClick={downloadQR}
        className="text-pink-400 hover:text-pink-300 font-bold text-sm underline flex items-center"
      >
        Download QR Image
      </button>
    </div>
  );
};

export default QRCodeGenerator;
