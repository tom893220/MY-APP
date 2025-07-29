'use client'
import React, { useState, useRef, useEffect } from 'react';

// 安全的 SVG 顯示組件
const SvgDisplay: React.FC<{
  svgString: string;
  width?: string;
  height?: string;
  className?: string;
}> = ({ svgString, width = '100%', height = '100%', className = '' }) => {
  // 方法1: 使用 data URL
  const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  
  return (
    <img 
      src={svgDataUrl}
      alt="SVG Generated"
      className={className}
      style={{ 
        width, 
        height,
        imageRendering: 'pixelated' // 保持像素風格
      }}
    />
  );
};

// 方法2: 直接生成 React SVG 元素的組件
const ReactSvgDisplay: React.FC<{
  array: number[][];
  colorMap: { [key: number]: string };
  width?: string;
  height?: string;
  className?: string;
}> = ({ array, colorMap, width = '50px', height = '50px', className = '' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      className={className}
      viewBox="0 0 50 50"
      style={{ imageRendering: 'pixelated' }}
    >
      {array.map((row, i) =>
        row.map((value, j) => (
          <rect
            key={`${i}-${j}`}
            x={j}
            y={i}
            width={1}
            height={1}
            fill={colorMap[value]}
          />
        ))
      )}
    </svg>
  );
};

const ArrayToCanvasSvg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [array2D, setArray2D] = useState<number[][]>([]);

  // 顏色映射：0~6 對應 紅橙黃綠藍紫黑
  const colorMap: { [key: number]: string } = {
    0: '#FF0000', // 紅
    1: '#FF8000', // 橙
    2: '#FFFF00', // 黃
    3: '#00FF00', // 綠
    4: '#0000FF', // 藍
    5: '#8000FF', // 紫
    6: '#000000'  // 黑
  };

  // 生成 50x50 的隨機二維陣列
  const generateRandomArray = (): number[][] => {
    const size = 50;
    const newArray: number[][] = [];
    
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(Math.floor(Math.random() * 7)); // 0~6 隨機數
      }
      newArray.push(row);
    }
    
    return newArray;
  };

  // 將二維陣列轉換為 Canvas Base64
  const arrayToCanvasBase64 = (array: number[][]): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 設置 canvas 大小為 50x50 像素
    canvas.width = 50;
    canvas.height = 50;

    // 清空 canvas
    ctx.clearRect(0, 0, 50, 50);

    // 繪製每個像素
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        const value = array[i][j];
        const color = colorMap[value];
        
        ctx.fillStyle = color;
        ctx.fillRect(j, i, 1, 1); // 每個元素 1x1 像素
      }
    }

    // 轉換為 base64
    return canvas.toDataURL('image/png');
  };

  // 將二維陣列轉換為 SVG
  const arrayToSvg = (array: number[][]): string => {
    const size = array.length;
    let svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
    
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        const value = array[i][j];
        const color = colorMap[value];
        
        // 每個元素為 1x1 的矩形
        svgContent += `<rect x="${j}" y="${i}" width="1" height="1" fill="${color}"/>`;
      }
    }
    
    svgContent += '</svg>';
    return svgContent;
  };

  // 生成新的陣列和圖像
  const generateNewImages = () => {
    const newArray = generateRandomArray();
    setArray2D(newArray);
    
    // 生成 Canvas Base64
    const base64 = arrayToCanvasBase64(newArray);
    setBase64String(base64);
    
    // 生成 SVG
    const svg = arrayToSvg(newArray);
    setSvgString(svg);
  };

  // 初始化
  useEffect(() => {
    generateNewImages();
  }, []);

  // 下載 Base64 為圖片
  const downloadBase64Image = () => {
    if (!base64String) return;
    
    const link = document.createElement('a');
    link.download = 'canvas-image.png';
    link.href = base64String;
    link.click();
  };

  // 下載 SVG 檔案
  const downloadSvg = () => {
    if (!svgString) return;
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'array-image.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 複製到剪貼板
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} 已複製到剪貼板！`);
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">二維陣列轉 Canvas Base64 和 SVG</h1>
      
      {/* 控制按鈕 */}
      <div className="mb-6">
        <button 
          onClick={generateNewImages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
        >
          生成新的隨機陣列
        </button>
      </div>

      {/* 隱藏的 Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Canvas Base64 結果 */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Canvas Base64 結果</h2>
          
          {base64String && (
            <div>
              <div className="mb-4">
                <h3 className="font-medium mb-2">預覽圖片 (放大顯示):</h3>
                <img 
                  src={base64String} 
                  alt="Canvas Generated" 
                  className="border"
                  style={{ 
                    width: '200px', 
                    height: '200px', 
                    imageRendering: 'pixelated' 
                  }}
                />
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">實際大小 (50x50px):</h3>
                <img 
                  src={base64String} 
                  alt="Canvas Generated Actual Size" 
                  className="border"
                  style={{ 
                    width: '50px', 
                    height: '50px',
                    imageRendering: 'pixelated'
                  }}
                />
              </div>

              <div className="mb-4">
                <button 
                  onClick={downloadBase64Image}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                >
                  下載 PNG
                </button>
                <button 
                  onClick={() => copyToClipboard(base64String, 'Base64')}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  複製 Base64
                </button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Base64 字串:</h3>
                <textarea 
                  value={base64String}
                  readOnly
                  className="w-full h-32 p-2 border rounded text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* SVG 結果 */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">SVG 結果</h2>
          
          {svgString && (
            <div>
              <div className="mb-4">
                <h3 className="font-medium mb-2">預覽圖片 (放大顯示):</h3>
                <SvgDisplay 
                  svgString={svgString} 
                  width="200px" 
                  height="200px" 
                  className="border"
                />
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">實際大小 (50x50px):</h3>
                <SvgDisplay 
                  svgString={svgString} 
                  width="50px" 
                  height="50px" 
                  className="border"
                />
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">React SVG 元素 (放大顯示):</h3>
                <ReactSvgDisplay 
                  array={array2D}
                  colorMap={colorMap}
                  width="200px"
                  height="200px"
                  className="border"
                />
              </div>

              <div className="mb-4">
                <button 
                  onClick={downloadSvg}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                >
                  下載 SVG
                </button>
                <button 
                  onClick={() => copyToClipboard(svgString, 'SVG')}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  複製 SVG
                </button>
              </div>

              <div>
                <h3 className="font-medium mb-2">SVG 代碼:</h3>
                <textarea 
                  value={svgString}
                  readOnly
                  className="w-full h-32 p-2 border rounded text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 顏色對照表 */}
      <div className="mt-6 border p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">顏色對照表</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(colorMap).map(([value, color]) => (
            <div key={value} className="flex items-center gap-2">
              <div 
                className="w-6 h-6 border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">
                {value}: {color}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 陣列預覽 (只顯示前 10x10 作為示例) */}
      {array2D.length > 0 && (
        <div className="mt-6 border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">陣列預覽 (前 10x10)</h3>
          <div className="overflow-auto">
            <table className="text-xs">
              <tbody>
                {array2D.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {row.slice(0, 10).map((value, j) => (
                      <td 
                        key={j} 
                        className="w-6 h-6 text-center border"
                        style={{ 
                          backgroundColor: colorMap[value],
                          color: value === 2 ? '#000' : '#fff'
                        }}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArrayToCanvasSvg;