import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ExpandMore } from '@mui/icons-material';
/** 작성자: 김대호 */
/**
 * 재사용 가능한 Dropdown 컴포넌트
 * @param {Object} props
 * @param {Array} props.options - 드롭다운 옵션 배열 [{ value: 'value', label: 'Label' }]
 * @param {string} props.value - 현재 선택된 값
 * @param {Function} props.onChange - 값 변경 핸들러 (value) => {}
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.width - 드롭다운 너비 (CSS 클래스)
 */
function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = '선택하세요',
  className = '',
  disabled = false,
  width = 'w-full'
}) {
  // 현재 선택된 옵션 찾기
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // onChange 핸들러
  const handleOptionSelect = (optionValue) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <Menu as="div" className={`relative ${width}`}>
      <MenuButton
        disabled={disabled}
        className={`dropdownmenu
          ${className}
        `}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
          {displayText}
        </span>
        <ExpandMore 
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200`} 
        />
      </MenuButton>

      <MenuItems
        className={`absolute left-0 mt-1 ${width} dropdownitem`}
        transition
      >
        {options.map((option) => (
          <MenuItem key={option.value}>
            {({ focus }) => (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOptionSelect(option.value);
                }}
                className={`
                  w-full px-3 py-2 text-left rounded-lg text-sm transition-colors duration-150
                  ${focus ? 'bg-green-100 text-black' : 'text-gray-900'}
                  ${value === option.value ? 'bg-green-200 font-medium' : ''}
                `}
              >
                {option.label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

export default Dropdown;
