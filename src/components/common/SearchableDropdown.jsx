import { useState, useCallback, useRef, useEffect } from 'react';
import { ExpandMore, Search, Close } from '@mui/icons-material';
/** 작성자: 김대호 */
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
  clearable = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // 검색어에 따른 필터링된 옵션들
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 현재 선택된 옵션 찾기
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    if (onChange) {
      onChange('');
    }
  }, [onChange]);

  const handleOptionSelect = useCallback((optionValue) => {
    if (onChange) {
      onChange(optionValue);
      setSearchTerm('');
      setIsOpen(false);
    }
  }, [onChange]);

  return (
    <div ref={dropdownRef} className={`relative ${width}`}>
      <button
        type="button"
        disabled={disabled}
        className={`dropdownmenu ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
          {displayText}
        </span>
        <ExpandMore 
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className={`absolute left-0 mt-1 ${width} dropdownitem`}>
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
                autoFocus={false}
              />
            </div>
          </div>

          {/* 옵션 목록 */}
          <div className="max-h-48 overflow-auto">
            {clearable && selectedOption && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClear();
                }}
                className="w-full px-3 py-2 text-left text-sm transition-colors duration-150 border-b border-gray-200 flex items-center gap-2 hover:bg-red-50 text-red-600"
              >
                <Close className="h-4 w-4" />
                선택 해제
              </button>
            )}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOptionSelect(option.value);
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-sm transition-colors duration-150
                    hover:bg-blue-50 ${value === option.value ? 'bg-blue-100 font-medium text-blue-900' : 'text-gray-900'}
                  `}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
