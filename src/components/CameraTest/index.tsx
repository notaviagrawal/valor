'use client';

import { useRef, useState } from 'react';

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      console.log('Starting camera test...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      console.log('Stream obtained:', stream);
      console.log('Stream tracks:', stream.getTracks());

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        console.log('iOS detected:', isIOS);
        
        if (isIOS) {
          console.log('iOS: Playing video immediately');
          try {
            videoRef.current.play();
            console.log('iOS: Video play() called');
            setIsStreaming(true);
          } catch (playError) {
            console.error('iOS play error:', playError);
            setError('iOS video failed: ' + playError.message);
          }
        } else {
          // Non-iOS handling
          const playVideo = async () => {
            try {
              console.log('Attempting to play video...');
              await videoRef.current?.play();
              console.log('Video playing successfully');
              setIsStreaming(true);
            } catch (playError) {
              console.error('Play error:', playError);
              setError('Video failed to play: ' + playError.message);
            }
          };

          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            playVideo();
          };

          videoRef.current.oncanplay = () => {
            console.log('Video can play');
            playVideo();
          };

          // If metadata is already loaded, play immediately
          if (videoRef.current.readyState >= 1) {
            console.log('Video metadata already loaded, playing immediately');
            playVideo();
          }
        }
      }
    } catch (err: any) {
      console.error('Camera test error:', err);
      setError(err.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Camera Test</h2>
      
      <div className="mb-4">
        <button
          onClick={startCamera}
          disabled={isStreaming}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-400"
        >
          Start Camera
        </button>
        <button
          onClick={stopCamera}
          disabled={!isStreaming}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Stop Camera
        </button>
        <button
          onClick={() => videoRef.current?.play()}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        >
          Force Play
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 bg-black"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Status: {isStreaming ? 'Streaming' : 'Not streaming'}
      </div>
    </div>
  );
}
