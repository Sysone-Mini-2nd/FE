import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ExpandMore, Search, Close } from '@mui/icons-material';

/**
 * 검색 기능이 있는 Dropdown 컴포넌트
 * @param {Object} props
 * @param {Array} props.options - 드롭다운 옵션 배열 [{ value: 'value', label: 'Label' }]
 * @param {string} props.value - 현재 선택된 값
 * @param {Function} props.onChange - 값 변경 핸들러 (value) => {}
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {string} props.searchPlaceholder - 검색 플레이스홀더 텍스트
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.width - 드롭다운 너비 (CSS 클래스)
 * @param {string} props.anchor - 드롭다운 위치 (기본: 'bottom start')
 * @param {boolean} props.clearable - 선택 해제 가능 여부
 */
function SearchableDropdown({
  options = [],
  value,
  onChange,
  placeholder = '선택하세요',
  searchPlaceholder = '검색...',
  className = '',
  disabled = false,
  width = 'w-full',
  anchor = 'bottom start',
  clearable = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 검색어에 따른 필터링된 옵션들
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 현재 선택된 옵션 찾기
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
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
          flex items-center justify-between
          ${className}
        `}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
          {displayText}
        </span>
        <div className="flex items-center gap-1">
          {clearable && selectedOption && (
            <button
              onClick={handleClear}
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
        {/* 검색 입력 */}
        <div className="p-2 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* 옵션 목록 */}
        <div className="max-h-48 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <MenuItem key={option.value}>
                {({ focus }) => (
                  <button
                    onClick={() => {
                      onChange(option.value);
                      setSearchTerm('');
                    }}
                    className={`
                      w-full px-3 py-2 text-left text-sm transition-colors duration-150
                      ${focus ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                      ${value === option.value ? 'bg-blue-100 font-medium' : ''}
                    `}
                  >
                    {option.label}
                  </button>
                )}
              </MenuItem>
            ))
          )}
        </div>
      </MenuItems>
    </Menu>
  );
}

export default SearchableDropdown;
