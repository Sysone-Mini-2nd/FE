import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ExpandMore, Close, Check } from '@mui/icons-material';

/**
 * 다중 선택이 가능한 Dropdown 컴포넌트
 * @param {Object} props
 * @param {Array} props.options - 드롭다운 옵션 배열 [{ value: 'value', label: 'Label' }]
 * @param {Array} props.values - 현재 선택된 값들의 배열
 * @param {Function} props.onChange - 값 변경 핸들러 (values) => {}
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.width - 드롭다운 너비 (CSS 클래스)
 * @param {string} props.anchor - 드롭다운 위치 (기본: 'bottom start')
 * @param {number} props.maxDisplay - 최대 표시할 선택된 항목 수 (기본: 2)
 */
function MultiSelectDropdown({
  options = [],
  values = [],
  onChange,
  placeholder = '선택하세요',
  className = '',
  disabled = false,
  width = 'w-full',
  anchor = 'bottom start',
  maxDisplay = 2
}) {
  // 현재 선택된 옵션들 찾기
  const selectedOptions = options.filter(option => values.includes(option.value));
  
  // 표시할 텍스트 생성
  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length <= maxDisplay) {
      return selectedOptions.map(option => option.label).join(', ');
    }
    return `${selectedOptions.slice(0, maxDisplay).map(option => option.label).join(', ')} +${selectedOptions.length - maxDisplay}`;
  };

  const handleToggleOption = (optionValue) => {
    const newValues = values.includes(optionValue)
      ? values.filter(v => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  };

  const handleRemoveOption = (optionValue, e) => {
    e.stopPropagation();
    const newValues = values.filter(v => v !== optionValue);
    onChange(newValues);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Menu as="div" className={`relative ${width}`}>
      <MenuButton
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          hover:border-gray-400 transition-colors duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          flex items-center justify-between min-h-[40px]
          ${className}
        `}
      >
        <div className="flex-1 min-w-0">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : selectedOptions.length <= maxDisplay ? (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {option.label}
                  <button
                    onClick={(e) => handleRemoveOption(option.value, e)}
                    className="hover:bg-blue-200 rounded"
                  >
                    <Close className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-900 truncate">
              {getDisplayText()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {selectedOptions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              <Close className="h-3 w-3 text-gray-400" />
            </button>
          )}
          <ExpandMore 
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ui-open:rotate-180`} 
          />
        </div>
      </MenuButton>

      <MenuItems
        anchor={anchor}
        className={`
          z-50 mt-1 max-h-60 overflow-auto rounded-lg bg-white py-1 shadow-lg 
          ring-1 ring-black ring-opacity-5 focus:outline-none
          transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0
          ${width}
        `}
        transition
      >
        {options.map((option) => {
          const isSelected = values.includes(option.value);
          return (
            <MenuItem key={option.value}>
              {({ focus }) => (
                <button
                  onClick={() => handleToggleOption(option.value)}
                  className={`
                    w-full px-3 py-2 text-left text-sm transition-colors duration-150
                    flex items-center justify-between
                    ${focus ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                  `}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}

export default MultiSelectDropdown;
