"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Emoji map
  const emojiMap: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😡",
    surprised: "😲",
    neutral: "😐",
  };

  useEffect(() => {
    async function startCamera() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
        setStream(userStream);
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    startCamera();
  }, []);

  // Fake detection loop
  useEffect(() => {
    if (!videoRef.current) return;
    const expressions = Object.keys(emojiMap);

    const interval = setInterval(() => {
      const randomExp = expressions[Math.floor(Math.random() * expressions.length)];
      setEmoji(emojiMap[randomExp]);
    }, 2000);

    const stopTimer = setTimeout(() => {
      clearInterval(interval);
      setShowResult(true);
      stopCamera();
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(stopTimer);
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center animate-fade-in">
        Face to Emoji Recognition
      </h1>

      {!showResult && (
        <div className="relative flex flex-col items-center space-y-6">
          {/* Camera Frame */}
          <div className="relative p-2 bg-white rounded-2xl shadow-2xl border-4 border-purple-400 animate-pulse">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-72 h-56 md:w-96 md:h-72 rounded-xl object-cover"
            />
            {emoji && (
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
                {emoji}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowResult(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Finish Detection
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Result Popup */}
      {showResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 rounded-2xl p-8 w-80 sm:w-96 shadow-2xl text-center animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Your Emotion Result</h2>
            <div className="text-7xl mb-4">{emoji}</div>
            <p className="mb-6">We detected your mood from the camera session.</p>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
