import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ x, y, visible, items, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1"
      style={{ top: y, left: x }}
    >
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => {
                item.action();
                onClose();
              }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${item.isDestructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'}`}>
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
