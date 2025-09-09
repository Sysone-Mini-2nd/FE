import React from 'react';
import { People } from '@mui/icons-material';

function ParticipantList({ participants = [], title = "참석자", gridCols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-6" }) {
  return (
    <div className="flex items-center gap-2">
      <People className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {title} ({participants.length}명)
      </span>
      <div className={`grid ${gridCols} gap-2`}>
        {participants.length > 0 ? (
          participants.map((participant, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
            >
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-medium text-white">
                {participant.slice(0, 1)}
              </div>
              <span className="text-xs text-gray-700">
                {participant}
              </span>
            </div>
          ))
        ) : (
          <p className="col-span-full text-sm text-gray-500">
            참석자 정보가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default ParticipantList;
