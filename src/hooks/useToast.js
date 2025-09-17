import { useContext } from 'react';
import ToastContext from '../contexts/ToastContext';
/** 작성자: 김대호 */
export const useToast = () => {
  const context = useContext(ToastContext);
  return context;
};