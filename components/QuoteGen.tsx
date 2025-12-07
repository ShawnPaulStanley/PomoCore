import React, { useState, useEffect } from 'react';
import { Cat, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { generateQuote } from '../services/geminiService';
import { Quote } from '../types';

export const QuoteGen: React.FC = () => {
  const [quote, setQuote] = useState<Quote>({ text: "Loading vibes...", author: "" });
  const [loading, setLoading] = useState(false);
  const [meowMode, setMeowMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchNewQuote = async () => {
    setLoading(true);
    setCopied(false);
    const newQuote = await generateQuote(meowMode);
    setQuote(newQuote);
    setLoading(false);
  };

  useEffect(() => {
    fetchNewQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meowMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center transition-all duration-300 relative group hover:shadow-[6px_6px_0px_rgba(0,0,0,0.05)]">
      
      {/* Controls Header */}
      <div className="flex justify-between w-full mb-4 z-10">
         <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="p-2 rounded-full text-gray-400 hover:text-pastel-peach hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              title="Copy Quote"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
         </div>
         <button 
          onClick={() => setMeowMode(!meowMode)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${meowMode ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 border border-transparent'}`}
          title="Toggle Meow Mode"
        >
          <Cat size={14} />
          {meowMode ? 'Meow ON' : 'Meow OFF'}
        </button>
      </div>

      {/* Quote Display */}
      <div className="min-h-[100px] flex items-center justify-center w-full px-2">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-pastel-lavender animate-pulse">
             <RefreshCw className="animate-spin" size={24} />
             <span className="text-xs font-bold tracking-widest uppercase">Fetching Vibes...</span>
          </div>
        ) : (
          <div className="animate-[slideUpFade_0.5s_ease-out]">
             <p className={`font-hand text-2xl md:text-3xl mb-3 text-gray-700 dark:text-gray-200 leading-snug ${meowMode ? "italic" : ""}`}>
               "{quote.text}"
             </p>
             <div className="flex items-center justify-center gap-2">
               <span className="h-[1px] w-8 bg-pastel-peach"></span>
               <p className="text-xs text-gray-500 font-sans uppercase tracking-widest font-bold">{quote.author}</p>
               <span className="h-[1px] w-8 bg-pastel-peach"></span>
             </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <button 
        onClick={fetchNewQuote}
        disabled={loading}
        className="mt-6 text-xs font-bold text-gray-400 hover:text-pastel-peach flex items-center gap-1.5 transition-colors uppercase tracking-widest group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 duration-300"
      >
        <Sparkles size={14} className={loading ? "animate-spin" : ""} /> 
        Generate New Vibe
      </button>
    </div>
  );
};