import React, { useState } from 'react';
import { PlayArrow, Pause } from '@mui/icons-material';

function AudioPlayer({ audioFile, title = "회의 녹음", createdAt }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // 실제 구현에서는 audioRef를 사용하여 재생/일시정지
  };

  if (!audioFile) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">녹음 파일</h2>
      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
        <button
          onClick={togglePlayback}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <PlayArrow className="w-4 h-4" />
          )}
          {isPlaying ? "일시정지" : "재생"}
        </button>
        <div>
          <p className="text-sm">{title}</p>
          {createdAt && (
            <p className="text-xs">
              {new Date(createdAt).toLocaleDateString("ko-KR")} 녹음
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
