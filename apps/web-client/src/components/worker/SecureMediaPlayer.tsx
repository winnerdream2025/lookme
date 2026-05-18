"use client";

/**
 * SecureMediaPlayer
 *
 * Anti-cheat YouTube IFrame player for view/traffic tasks.
 * The submit button unlocks ONLY after the worker has accumulated
 * the required number of ACTIVE watching seconds.
 *
 * Blocked actions (pause timer):
 *  - Video paused
 *  - Tab hidden (Page Visibility API)
 *  - Video muted (mute = not really watching)
 *  - Seeking forward (skip = not watching)
 *
 * The component reports:
 *  - activeSeconds: real watched time (sent to backend for double-check)
 *  - sessionToken: HMAC signed token from backend (proves player was opened)
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { apiPost } from "@/lib/api";

interface SecureMediaPlayerProps {
  taskId: string;
  videoId: string;
  requiredSeconds: number;
  sessionToken: string;
  onComplete: (activeSeconds: number) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function SecureMediaPlayer({
  taskId,
  videoId,
  requiredSeconds,
  sessionToken,
  onComplete,
}: SecureMediaPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [seekBlocked, setSeekBlocked] = useState(false);

  const lastTimeRef = useRef<number>(0);
  const activeSecondsRef = useRef<number>(0);

  const progress = Math.min((activeSeconds / requiredSeconds) * 100, 100);
  const remaining = Math.max(0, requiredSeconds - activeSeconds);
  const remainingMin = Math.floor(remaining / 60);
  const remainingSec = remaining % 60;

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sendHeartbeat = useCallback((playerState: "PLAYING" | "PAUSED" | "ENDED") => {
    apiPost("/tasks/heartbeat", { taskId, sessionToken, playerState }).catch(() => {});
  }, [taskId, sessionToken]);

  // Stop accumulation interval
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    sendHeartbeat("PAUSED");
    setIsPlaying(false);
  }, [sendHeartbeat]);

  // Start accumulation interval — only ticks while video is truly PLAYING
  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    setIsPlaying(true);
    sendHeartbeat("PLAYING"); // immediate first beat
    intervalRef.current = setInterval(() => {
      activeSecondsRef.current += 1;
      setActiveSeconds(activeSecondsRef.current);
      if (activeSecondsRef.current >= requiredSeconds) {
        stopTimer();
        setIsComplete(true);
        sendHeartbeat("ENDED");
      }
    }, 1000);
    // Heartbeat every 5s while playing
    heartbeatRef.current = setInterval(() => {
      sendHeartbeat("PLAYING");
    }, 5000);
  }, [requiredSeconds, stopTimer, sendHeartbeat]);

  // Page Visibility API — pause when tab hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabHidden(true);
        stopTimer();
        playerRef.current?.pauseVideo?.();
      } else {
        setTabHidden(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [stopTimer]);

  // Load YouTube IFrame API once
  useEffect(() => {
    const loadAPI = () => {
      if (window.YT?.Player) {
        initPlayer();
        return;
      }
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    };

    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,      // no fullscreen (harder to track)
          iv_load_policy: 3,
        },
        events: {
          onStateChange: handleStateChange,
        },
      });
    };

    loadAPI();

    return () => {
      stopTimer();
      playerRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleStateChange = useCallback((event: any) => {
    const YT_PLAYING = 1;
    const YT_PAUSED  = 2;
    const YT_ENDED   = 0;

    const player = event.target;

    if (event.data === YT_PLAYING) {
      // Block seeking: if worker jumped forward more than 2s, rewind
      const currentTime = player.getCurrentTime() as number;
      if (currentTime > lastTimeRef.current + 2.5) {
        player.seekTo(lastTimeRef.current, true);
        setSeekBlocked(true);
        setTimeout(() => setSeekBlocked(false), 2000);
        return;
      }
      lastTimeRef.current = currentTime;

      // Block muted video
      if (player.isMuted()) {
        player.pauseVideo();
        stopTimer();
        return;
      }

      startTimer();
    } else if (event.data === YT_PAUSED || event.data === YT_ENDED) {
      const currentTime = player.getCurrentTime() as number;
      lastTimeRef.current = currentTime;
      stopTimer();
    }
  }, [startTimer, stopTimer]);

  // Update lastTime while playing to allow short seeks detection
  useEffect(() => {
    if (!isPlaying) return;
    const tick = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.() as number | undefined;
      if (t !== undefined) lastTimeRef.current = t;
    }, 500);
    return () => clearInterval(tick);
  }, [isPlaying]);

  return (
    <div className="space-y-4">
      {/* Tab-hidden warning */}
      {tabHidden && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          Timer paused — return to this tab to resume
        </div>
      )}

      {/* Seek blocked warning */}
      {seekBlocked && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Skipping is not allowed — video rewound to last position
        </div>
      )}

      {/* YouTube player */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className={isPlaying ? "text-blue-600" : "text-[#6B7280]"}>
            {isPlaying ? "▶ Watching…" : isComplete ? "✓ Done" : "⏸ Paused"}
          </span>
          <span className={isComplete ? "text-emerald-600" : "text-[#374151]"}>
            {isComplete
              ? `${requiredSeconds}s completed`
              : `${remainingMin > 0 ? `${remainingMin}m ` : ""}${remainingSec}s remaining`}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              isComplete ? "bg-emerald-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Rules */}
      <div className="grid grid-cols-2 gap-2 text-xs text-[#6B7280]">
        {[
          { icon: "🔊", text: "Keep sound on" },
          { icon: "👁", text: "Stay on this tab" },
          { icon: "▶", text: "Keep video playing" },
          { icon: "⏩", text: "No fast-forwarding" },
        ].map((r) => (
          <div key={r.text} className="flex items-center gap-1.5 p-2 bg-[#F6F5F3] rounded-lg">
            <span>{r.icon}</span>
            <span>{r.text}</span>
          </div>
        ))}
      </div>

      {/* Submit unlock button */}
      <button
        disabled={!isComplete}
        onClick={() => isComplete && onComplete(activeSecondsRef.current)}
        className={`w-full h-12 rounded-xl text-sm font-bold transition-all ${
          isComplete
            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-[0.98]"
            : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        {isComplete ? "Watching complete — Continue to Submit Proof →" : `Wait ${remainingMin > 0 ? `${remainingMin}m ` : ""}${remainingSec}s`}
      </button>
    </div>
  );
}
