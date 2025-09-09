import React from 'react';

function BadgeComponent({ type, customConfig = {} }) {
  const defaultTypeConfig = {
    "Daily Scrum": {
      label: "Daily Scrum",
      className: "bg-purple-100 text-purple-800",
    },
    "Sprint Planning Meeting": {
      label: "Sprint Planning",
      className: "bg-indigo-100 text-indigo-800",
    },
    "Sprint Review": {
      label: "Sprint Review",
      className: "bg-green-100 text-green-800",
    },
    "Sprint Retrospective": {
      label: "Sprint Retro",
      className: "bg-orange-100 text-orange-800",
    },
    기타: { label: "기타", className: "bg-gray-100 text-gray-800" },
  };

  const typeConfig = { ...defaultTypeConfig, ...customConfig };
  const config = typeConfig[type] || typeConfig["기타"];

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default BadgeComponent;
