import { useState, useCallback, useRef, useEffect } from 'react';
import { ExpandMore, Close, Check } from '@mui/icons-material';
/** 작성자: 김대호 */
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
  maxDisplay = 2
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 현재 선택된 옵션들 찾기
  const selectedOptions = options.filter(option => values.includes(option.value));

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

  const handleToggleOption = useCallback((optionValue) => {
    if (!onChange) return;
    
    const newValues = values.includes(optionValue)
      ? values.filter(v => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  }, [onChange, values]);

  const handleClearAll = useCallback(() => {
    if (onChange) {
      onChange([]);
    }
  }, [onChange]);

  const displayText = selectedOptions.length === 0 
    ? placeholder 
    : selectedOptions.length <= maxDisplay 
      ? selectedOptions.map(option => option.label).join(', ')
      : `${selectedOptions.slice(0, maxDisplay).map(option => option.label).join(', ')} +${selectedOptions.length - maxDisplay}개`;

  return (
    <div ref={dropdownRef} className={`relative ${width}`}>
      <button
        type="button"
        disabled={disabled}
        className={`dropdownmenu ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`block truncate ${selectedOptions.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
          {displayText}
        </span>
        <ExpandMore 
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className={`absolute left-0 mt-1 ${width} dropdownitem`}>
          {selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClearAll();
              }}
              className="w-full px-3 py-2 text-left text-sm transition-colors duration-150 border-b border-gray-200 flex items-center gap-2 hover:bg-red-50 text-red-600"
            >
              <Close/>
              모든 선택 해제
            </button>
          )}
          {options.map((option) => {
            const isSelected = values.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleOption(option.value);
                }}
                className="w-full px-3 py-2 text-left text-sm transition-colors duration-150 flex items-center justify-between hover:bg-blue-50 text-gray-900"
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Check className="text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
