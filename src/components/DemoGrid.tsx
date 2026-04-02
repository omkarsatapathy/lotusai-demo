import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

const demos = [
  {
    title: "SEO Article Generation",
    description:
      "Multi-agent pipeline that researches, outlines, writes, and validates SEO-optimized articles with real-time quality scoring.",
    icon: "/multi-agent.png",
    gradient: "from-purple-500 to-pink-500",
    href: "/seo-article-generation/index.html",
    docsHref: "/seo-article-generation/docs.html",
    status: "live" as const,
  },
  {
    title: "AI Podcast Generator",
    description:
      "Autonomous 5-phase LangGraph pipeline that researches, scripts, voices, and masters full podcast episodes from any topic.",
    icon: "/podcast.png",
    gradient: "from-blue-500 to-cyan-500",
    href: "#",
    docsHref: "/ai-podcast-generator/docs.html",
    audioHref: "/ai-podcast-generator/demo.mp3",
    status: "live" as const,
  },
  {
    title: "Daily News Update via Telegram",
    description:
      "Autonomous pipeline that researches breaking news, generates a multi-speaker audio briefing, and delivers it straight to your Telegram — daily, hands-free.",
    icon: "/Telegram_logo.png",
    gradient: "from-violet-500 to-purple-700",
    href: "#",
    docsHref: "/podcast-creator/docs.html",
    audioHref: "/podcast-creator/demo.mp3",
    status: "live" as const,
  },
  {
    title: "MCP & A2A Agent Orchestration",
    description:
      "Two complementary agent interoperability patterns on AWS Bedrock AgentCore — an A2A research agent with a LangGraph pipeline and an MCP fashion tool server with dynamic discovery.",
    icon: "/mcp-a2a-icon.png",
    gradient: "from-amber-500 to-orange-500",
    href: "#",
    docsHref: "/mcp-a2a-orchestration/docs.html",
    docsOnly: true,
    status: "live" as const,
  },
  {
    title: "Conversational AI Agent",
    description:
      "Context-aware chatbot with RAG integration, multi-turn dialogue management, and knowledge base grounding.",
    icon: "💬",
    gradient: "from-orange-500 to-amber-500",
    href: "#",
    status: "soon" as const,
  },
  {
    title: "Data Analytics Studio",
    description:
      "Natural language to SQL converter with visualization engine. Ask questions about your data in plain English.",
    icon: "📊",
    gradient: "from-pink-500 to-rose-500",
    href: "#",
    status: "soon" as const,
  },
  {
    title: "Semantic Search Engine",
    description:
      "Multi-modal semantic search across text and images using CLIP embeddings and vector similarity matching.",
    icon: "🔍",
    gradient: "from-indigo-500 to-purple-500",
    href: "#",
    status: "soon" as const,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function fmtTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function AudioPlayerPopup({
  audioSrc,
  onClose,
}: {
  audioSrc: string;
  onClose: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animRef = useRef<number>(0);
  const dataRef = useRef<Uint8Array | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  const drawIdleWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    canvas.width = w;
    canvas.height = h;

    const isDark = document.documentElement.classList.contains("dark");
    ctx.clearRect(0, 0, w, h);
    const barCount = 64;
    const gap = 2 * dpr;
    const barWidth = (w - (barCount - 1) * gap) / barCount;

    for (let i = 0; i < barCount; i++) {
      const seed = Math.sin(i * 0.3) * 0.3 + 0.15;
      const barH = Math.max(3 * dpr, seed * h * 0.6);
      const x = i * (barWidth + gap);
      const y = (h - barH) / 2;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, 2 * dpr);
      ctx.fillStyle = isDark ? "#253040" : "#d0d7de";
      ctx.globalAlpha = 0.5;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, []);

  const drawWave = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const audio = audioRef.current;
    const dataArray = dataRef.current;
    if (!canvas || !analyser || !dataArray || !audio) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    analyser.getByteFrequencyData(dataArray);
    const isDark = document.documentElement.classList.contains("dark");
    ctx.clearRect(0, 0, w, h);

    const barCount = 64;
    const gap = 2 * dpr;
    const barWidth = (w - (barCount - 1) * gap) / barCount;
    const step = Math.floor(dataArray.length / barCount);

    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#ff6200");
    grad.addColorStop(1, "#ffa500");

    const progress = audio.duration ? audio.currentTime / audio.duration : 0;

    for (let i = 0; i < barCount; i++) {
      const val = dataArray[i * step] / 255;
      const barH = Math.max(3 * dpr, val * h * 0.85);
      const x = i * (barWidth + gap);
      const y = (h - barH) / 2;
      const isPast = (x + barWidth) / w <= progress;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, 2 * dpr);
      if (isPast) {
        ctx.fillStyle = grad;
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = isDark ? "#253040" : "#d0d7de";
        ctx.globalAlpha = 0.7 + val * 0.3;
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    animRef.current = requestAnimationFrame(drawWave);
  }, []);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.crossOrigin = "anonymous";
    audio.volume = volume / 100;
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () =>
      setCurrentTime(audio.currentTime)
    );
    audio.addEventListener("ended", () => {
      setPlaying(false);
      cancelAnimationFrame(animRef.current);
      drawIdleWave();
    });

    drawIdleWave();

    return () => {
      audio.pause();
      audio.src = "";
      cancelAnimationFrame(animRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [audioSrc, drawIdleWave]);

  const setupContext = () => {
    if (audioCtxRef.current) return;
    const audio = audioRef.current!;
    const actx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const analyser = actx.createAnalyser();
    analyser.fftSize = 256;
    const source = actx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(actx.destination);
    audioCtxRef.current = actx;
    analyserRef.current = analyser;
    sourceRef.current = source;
    dataRef.current = new Uint8Array(analyser.frequencyBinCount);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setupContext();
    if (audioCtxRef.current?.state === "suspended")
      audioCtxRef.current.resume();

    if (audio.paused) {
      audio.play();
      setPlaying(true);
      drawWave();
    } else {
      audio.pause();
      setPlaying(false);
      cancelAnimationFrame(animRef.current);
    }
  };

  const seekRel = (s: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + s)
    );
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
    if (v > 0) setMuted(false);
  };

  const handleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="bg-card border border-border"
        style={{
          width: 546,
          maxWidth: "92vw",
          borderRadius: 16,
          padding: "36px 31px 31px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Now Playing
          </div>
          <div
            className="text-foreground"
            style={{ fontSize: 15, fontWeight: 600 }}
          >
            AI-Generated Podcast Episode
          </div>
          <div
            className="text-muted-foreground"
            style={{ fontSize: 12, marginTop: 2 }}
          >
            Produced entirely by the Lotus AI pipeline
          </div>
          <div
            className="text-foreground"
            style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}
          >
            Impending China Taiwan War
          </div>
        </div>

        {/* Waveform */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="bg-secondary border border-border"
          style={{
            width: "100%",
            height: 104,
            borderRadius: 8,
            marginBottom: 10,
            cursor: "pointer",
            display: "block",
          }}
        />

        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="1000"
          value={duration ? (currentTime / duration) * 1000 : 0}
          onChange={(e) => {
            const audio = audioRef.current;
            if (!audio || !audio.duration) return;
            audio.currentTime = (Number(e.target.value) / 1000) * audio.duration;
          }}
          style={{
            width: "100%",
            accentColor: "#ff6200",
            cursor: "pointer",
            marginBottom: 6,
            display: "block",
          }}
        />

        {/* Time */}
        <div
          className="text-muted-foreground"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            marginBottom: 14,
            fontFamily: "'Courier New', monospace",
          }}
        >
          <span>{fmtTime(currentTime)}</span>
          <span>{fmtTime(duration)}</span>
        </div>

        {/* Controls — 3-column: spacer | play | right-controls */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Left spacer balances right controls */}
          <div style={{ flex: 1 }} />

          {/* Play/Pause — true center */}
          <button
            onClick={togglePlay}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(168,85,247,0.4)",
            }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="3" width="4" height="18" />
                <rect x="15" y="3" width="4" height="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>

          {/* Right controls */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
            {/* Rewind */}
            <button
              onClick={() => seekRel(-15)}
              className="text-muted-foreground hover:text-foreground"
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
              aria-label="Rewind 15s"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                <text x="12" y="16" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">15</text>
              </svg>
            </button>

            {/* Forward */}
            <button
              onClick={() => seekRel(15)}
              className="text-muted-foreground hover:text-foreground"
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
              aria-label="Forward 15s"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
                <text x="12" y="16" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">15</text>
              </svg>
            </button>

            {/* Volume */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={handleMute}
                className="text-muted-foreground hover:text-foreground"
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                aria-label="Mute"
              >
                {muted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
                style={{ width: 64, accentColor: "#a855f7", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoGrid() {
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerSrc, setPlayerSrc] = useState("");

  const openPlayer = (src: string) => {
    setPlayerSrc(src);
    setPlayerOpen(true);
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {demos.map((demo, index) => {
          const hasAudio = "audioHref" in demo;
          return (
            <motion.div
              key={index}
              variants={item}
              className={`demo-card group relative p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                demo.status === "soon" ? "opacity-70" : ""
              }`}
            >
              {/* Gradient banner with icon + title */}
              <div
                className={`relative rounded-xl bg-gradient-to-br ${demo.gradient} mb-4 flex flex-col items-center justify-center gap-2 py-5 px-4 overflow-hidden`}
              >
                {demo.icon.startsWith("/") ? (
                  <img
                    src={demo.icon}
                    alt=""
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}
                  />
                ) : (
                  <span className="text-2xl">{demo.icon}</span>
                )}
                <h3 className="text-base font-bold text-white text-center leading-tight">
                  {demo.title}
                </h3>
                <span
                  className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    demo.status === "live"
                      ? "bg-green-500/90 text-white"
                      : "bg-amber-500/90 text-white"
                  }`}
                >
                  {demo.status === "live" ? "Live" : "Soon"}
                </span>
              </div>

              <p className="text-muted-foreground flex-1 text-sm">
                {demo.description}
              </p>

              <div className="mt-5 flex gap-2">
                {demo.status === "live" ? (
                  <>
                    {"docsOnly" in demo && (demo as any).docsOnly ? (
                      <a
                        href={
                          (demo as typeof demo & { docsHref: string }).docsHref
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                      >
                        Read Deep Dive &rarr;
                      </a>
                    ) : hasAudio ? (
                      <button
                        onClick={() =>
                          openPlayer(
                            (demo as typeof demo & { audioHref: string })
                              .audioHref
                          )
                        }
                        className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 transition-opacity cursor-pointer border-none"
                      >
                        Listen
                      </button>
                    ) : (
                      <a
                        href={demo.href}
                        className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                      >
                        Launch &rarr;
                      </a>
                    )}
                    {!("docsOnly" in demo && (demo as any).docsOnly) && "docsHref" in demo && (
                      <a
                        href={
                          (demo as typeof demo & { docsHref: string }).docsHref
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold border border-purple-500/40 text-purple-500 hover:bg-purple-500/10 transition-colors"
                      >
                        Read
                      </a>
                    )}
                  </>
                ) : (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold border border-border text-muted-foreground cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {playerOpen && (
        <AudioPlayerPopup
          audioSrc={playerSrc}
          onClose={() => setPlayerOpen(false)}
        />
      )}
    </>
  );
}
