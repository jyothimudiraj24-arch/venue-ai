import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Scale, 
  Award,
  Layers
} from 'lucide-react';

const DEMO_SCENES = [
  {
    time: 0,
    title: '1. Select Event Type & Date',
    desc: 'Organizer selects Wedding in Hyderabad with 200 guests and ₹1,50,000 budget.',
    highlight: 'Event Details Configuration',
    icon: Building2,
    gradient: 'from-blue-600/30 to-purple-600/30',
    tags: ['Wedding', 'Hyderabad', '200 Guests', '₹1.5 Lakhs']
  },
  {
    time: 5,
    title: '2. Demographic & Accessibility Preferences',
    desc: 'Setting multi-generational age groups (Kids & Seniors) with ramps, rest zones, and parking.',
    highlight: 'Age Groups & Facilities',
    icon: Layers,
    gradient: 'from-purple-600/30 to-pink-600/30',
    tags: ['Senior Lounge', 'Wheelchair Ramps', 'Kids Safe Area', 'In-house Catering']
  },
  {
    time: 10,
    title: '3. 8-Agent AI Engine Orchestration',
    desc: 'Requirement, Planning, Research, Comparison, Accessibility, Budget, Decision, & Explanation agents execute.',
    highlight: 'Multi-Agent Processing',
    icon: Sparkles,
    gradient: 'from-pink-600/30 to-indigo-600/30',
    tags: ['8 Agents Active', 'Heuristic Scoring', 'Rule Engine', 'Multi-Score Vectors']
  },
  {
    time: 15,
    title: '4. Venue Catalog & 4-Way Comparison',
    desc: 'Filtering venues with real-time budget fit matrices, capacity match, and pros/cons.',
    highlight: 'Venue Matrix Comparison',
    icon: Scale,
    gradient: 'from-indigo-600/30 to-cyan-600/30',
    tags: ['Grand Imperial', 'Royal Orchid', 'Taj Deccan', 'Silver Oak']
  },
  {
    time: 20,
    title: '5. AI Recommendation & 2D Floor Plan Preview',
    desc: 'AI recommends #1 Grand Imperial Convention (96.4% Match) and generates adaptive 2D spatial layout.',
    highlight: 'Recommendation & Spatial Floor Plan',
    icon: Award,
    gradient: 'from-emerald-600/30 to-blue-600/30',
    tags: ['96.4% AI Match', 'Interactive Floor Plan', 'Kids & Senior Plan', 'Printable Schedule']
  }
];

export default function VideoPlayer({ onFinish, autoplay = false }) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(25); // 25 seconds interactive demo
  const [isMuted, setIsMuted] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Timer loop for simulated demo
  useEffect(() => {
    let interval = null;
    if (isPlaying && !customVideoUrl) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (onFinish) onFinish();
            return duration;
          }
          return prev + 0.5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, customVideoUrl, duration, onFinish]);

  const activeSceneIndex = DEMO_SCENES.findLastIndex((s) => currentTime >= s.time) || 0;
  const currentScene = DEMO_SCENES[activeSceneIndex] || DEMO_SCENES[0];
  const CurrentIcon = currentScene.icon;

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card border border-slate-700/80 shadow-2xl bg-dark-950">
      {/* Video Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden">
        {/* Background Ambient Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentScene.gradient} opacity-50 transition-all duration-700`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,9,19,0.85)_100%)]" />

        {/* Custom MP4 Video Player If Uploaded */}
        {customVideoUrl ? (
          <video
            ref={videoRef}
            src={customVideoUrl}
            className="absolute inset-0 w-full h-full object-cover z-10"
            autoPlay={isPlaying}
            controls={false}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          /* High-Tech Animated Simulated Demo Screen */
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            {/* Top Bar inside Video */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-slate-700/60 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-semibold text-slate-300">DEMO SIMULATION</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-purple-300 font-mono">
                  {Math.floor(currentTime)}s / {duration}s
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SmartVenue AI in Action</span>
              </div>
            </div>

            {/* Central Animated Scene Content */}
            <div className="my-auto max-w-xl mx-auto text-center space-y-4 py-4">
              <div className="inline-flex p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 shadow-rgb-glow transform transition-all duration-500 scale-105">
                <CurrentIcon className="w-10 h-10 text-rgb-purple animate-bounce" />
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-rgb-pink font-semibold">
                  {currentScene.highlight}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-['Outfit'] tracking-tight">
                  {currentScene.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {currentScene.desc}
                </p>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {currentScene.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-200 shadow-sm"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Status Pill */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live Agent Decision Simulation
              </span>
              <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
                AI Pipeline Status: Active (8 Agents)
              </span>
            </div>
          </div>
        )}

        {/* Play/Pause Large Overlay Trigger */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm group"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rgb-blue to-rgb-pink p-0.5 shadow-rgb-glow transition-transform group-hover:scale-110">
              <div className="w-full h-full bg-dark-950/90 rounded-full flex items-center justify-center pl-1">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Video Control Bar */}
      <div className="p-4 bg-dark-900 border-t border-slate-800/80 space-y-3">
        {/* Progress Bar Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 w-10 text-right">
            0:{Math.floor(currentTime).toString().padStart(2, '0')}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rgb-purple"
          />
          <span className="text-xs font-mono text-slate-400 w-10">
            0:{duration}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Right Controls: Upload MP4 option */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/mp4,video/webm"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              title="Load custom local MP4 video file"
            >
              <Upload className="w-3.5 h-3.5 text-rgb-blue" />
              <span>Load Local MP4</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
