import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2, PenLine, Undo2 } from 'lucide-react';

export const ScribbleBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4A4A4A');
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const [brushSize, setBrushSize] = useState(3);

  // Use refs to access latest state inside the resize listener closure
  const stateRef = useRef({ color, mode, brushSize });

  // Palette colors
  const colors = ['#4A4A4A', '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];

  useEffect(() => {
    stateRef.current = { color, mode, brushSize };
  }, [color, mode, brushSize]);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const setupCanvas = () => {
      const rect = container.getBoundingClientRect();

      // If container is hidden or has no size, skip resizing to avoid 0-dimension issues
      // This prevents the InvalidStateError when drawing from/to 0x0 canvases
      if (rect.width === 0 || rect.height === 0) return;

      // Save current content
      let tempCanvas: HTMLCanvasElement | null = null;
      if (canvas.width > 0 && canvas.height > 0) {
          tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, 0);
          }
      }

      // Resize
      canvas.width = rect.width;
      canvas.height = Math.max(300, rect.height); // Minimum height

      // Restore content
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Only draw if we have a valid temp canvas
        if (tempCanvas && tempCanvas.width > 0 && tempCanvas.height > 0) {
            ctx.drawImage(tempCanvas, 0, 0);
        }

        // Restore styles using the ref to get fresh state
        const currentState = stateRef.current;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentState.mode === 'erase' ? '#ffffff' : currentState.color;
        ctx.lineWidth = currentState.mode === 'erase' ? 20 : currentState.brushSize;
        if (currentState.mode === 'erase') {
           ctx.globalCompositeOperation = 'destination-out';
        } else {
           ctx.globalCompositeOperation = 'source-over';
        }
      }
    };

    setupCanvas();

    // Debounced resize handler
    let timeoutId: any;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setupCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update context when state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineWidth = mode === 'erase' ? 20 : brushSize;
      
      if (mode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
      }
    }
  }, [color, mode, brushSize]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    e.preventDefault(); // Prevent scrolling on touch
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-4 border border-gray-100 dark:border-gray-700 flex flex-col gap-3 group hover:shadow-[6px_6px_0px_rgba(0,0,0,0.05)] transition-all duration-300">
      
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
           <PenLine size={16} />
           <span className="text-xs font-bold uppercase tracking-widest">Scratchpad</span>
        </div>
        <button 
          onClick={clearCanvas}
          className="text-gray-300 hover:text-red-400 transition-colors p-1"
          title="Clear Page"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div 
        ref={containerRef} 
        className="relative w-full h-[500px] rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 dark:border-gray-700 bg-[#faf9f6] dark:bg-[#1a1a2e]"
      >
        {/* Dot Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10" 
             style={{
                backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px'
             }} 
        />
        
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 cursor-crosshair touch-none w-full h-full"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 pt-1">
         <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setMode('draw');
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${color === c && mode === 'draw' ? 'scale-110 border-gray-400 shadow-sm' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: c }}
                title="Color"
              />
            ))}
         </div>
         
         <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>

         <button
           onClick={() => setMode(mode === 'draw' ? 'erase' : 'draw')}
           className={`p-2 rounded-xl transition-all ${mode === 'erase' ? 'bg-pastel-peach text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
           title="Eraser"
         >
           <Eraser size={18} />
         </button>
      </div>
    </div>
  );
};