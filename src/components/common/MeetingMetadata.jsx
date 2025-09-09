import React from 'react';

function MeetingMetadata({ data, className = "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" }) {
  return (
    <div className={className}>
      {data.map((item, index) => (
        <div key={index}>
          <span>{item.label}:</span>
          <span className={`ml-2 ${item.className || ''}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default MeetingMetadata;
