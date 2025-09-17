import { useState, useEffect } from 'react';
/** 작성자: 조윤상 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // value가 변경된 후 delay 시간 뒤에 debouncedValue를 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup 함수: 이전 타이머를 제거하여 마지막 타이머만 실행되게 함
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
