import React, { useState, useEffect } from 'react';
import { Music, Plus, Link as LinkIcon, Disc, LogIn } from 'lucide-react';

const PRESETS = [
  { name: 'Lofi Girl', id: '0vvXsWCC9xrXsKd4FyS8kM' },
  { name: 'Deep Focus', id: '37i9dQZF1DWZeKCadgRdKQ' },
  { name: 'Piano', id: '37i9dQZF1DX4sWSpwq3LiO' },
  { name: 'Rain Sounds', id: '37i9dQZF1DX8Uebhn9wzrS' }
];

export const SpotifyPlayer: React.FC = () => {
  // Default to Lofi Girl
  const [embedUrl, setEmbedUrl] = useState("https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0");
  const [showInput, setShowInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [activePreset, setActivePreset] = useState<string>('Lofi Girl');
  const [showLoginButton, setShowLoginButton] = useState(true);

  useEffect(() => {
    // Check if user has clicked the login button before
    const hasClickedLogin = localStorage.getItem('spotifyLoginClicked');
    if (hasClickedLogin === 'true') {
      setShowLoginButton(false);
    }
  }, []);

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    setEmbedUrl(`https://open.spotify.com/embed/playlist/${preset.id}?utm_source=generator&theme=0`);
    setActivePreset(preset.name);
    setShowInput(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput) return;

    // Extract ID and type from standard Spotify URLs
    // Example: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...
    const match = customInput.match(/open\.spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
    
    if (match) {
      const type = match[1];
      const id = match[2];
      setEmbedUrl(`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`);
      setActivePreset('Custom');
      setShowInput(false);
      setCustomInput("");
    } else {
      alert("Please paste a valid Spotify link (Playlist, Album, or Track)");
    }
  };

  const handleLogin = () => {
    // Mark that user has clicked the login button
    localStorage.setItem('spotifyLoginClicked', 'true');
    setShowLoginButton(false);
    
    // Opens Spotify login in a popup window
    const width = 450;
    const height = 730;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    window.open(
      'https://accounts.spotify.com/en/login?continue=https%3A%2F%2Fopen.spotify.com%2F', 
      'Spotify Login', 
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-pastel-lavender/30 bg-black relative group">
         <iframe 
          style={{borderRadius: "12px"}} 
          src={embedUrl}
          width="100%" 
          height="152" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          title="Spotify Player"
          className="relative z-10"
        ></iframe>
      </div>

      {/* Login Helper - Centered */}
      {showLoginButton && (
        <div className="flex justify-center px-2 -mt-1">
           <button 
             onClick={handleLogin} 
             className="text-[11px] bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 font-semibold shadow-sm"
             title="Login to Spotify is required for full song playback. Otherwise only 30s previews are available."
           >
             <LogIn size={12} />
             <span>Login for Full Playback</span>
           </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center justify-center">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className={`
              px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1
              ${activePreset === preset.name 
                ? 'bg-pastel-peach text-pastel-text shadow-sm scale-105' 
                : 'bg-white/50 dark:bg-white/10 text-gray-500 hover:bg-white/80 dark:hover:bg-white/20'}
            `}
          >
            <Disc size={12} />
            {preset.name}
          </button>
        ))}
        
        <button
          onClick={() => setShowInput(!showInput)}
          className={`
            px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1
            ${activePreset === 'Custom'
              ? 'bg-pastel-lavender text-pastel-text shadow-sm'
              : 'bg-white/50 dark:bg-white/10 text-gray-500 hover:bg-white/80 dark:hover:bg-white/20'}
          `}
        >
          {showInput ? <LinkIcon size={12} /> : <Plus size={12} />}
          Custom
        </button>
      </div>

      {showInput && (
        <form onSubmit={handleCustomSubmit} className="flex gap-2 animate-float">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Paste Spotify Link..."
            className="flex-1 rounded-xl px-3 py-2 text-sm bg-white/80 dark:bg-black/40 border-2 border-pastel-lavender/50 focus:border-pastel-peach focus:outline-none transition-colors"
          />
          <button 
            type="submit"
            className="bg-pastel-mint hover:bg-teal-200 text-teal-800 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Load
          </button>
        </form>
      )}
    </div>
  );
};