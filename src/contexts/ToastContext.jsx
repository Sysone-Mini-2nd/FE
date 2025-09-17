import { createContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';
/** 작성자: 김대호 */
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // 토스트 추가 함수
  const showToast = useCallback((message, type = 'success', options = {}) => {
    const id = Date.now() + Math.random(); // 고유 ID 생성
    const newToast = {
      id,
      message,
      type,
      duration: options.duration || 5000,
      position: options.position || 'top-right'
    };

    setToasts(prev => [...prev, newToast]);

    // 자동 제거
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, newToast.duration);

    return id;
  }, []);

  // 토스트 제거
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // 모든 토스트 제거
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 편의 함수
  const showSuccess = useCallback((message, options) => 
    showToast(message, 'success', options), [showToast]);
  
  const showError = useCallback((message, options) => 
    showToast(message, 'error', options), [showToast]);
  
  const showWarning = useCallback((message, options) => 
    showToast(message, 'warning', options), [showToast]);
  
  const showInfo = useCallback((message, options) => 
    showToast(message, 'info', options), [showToast]);

  const value = {
    showToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* 토스트 렌더링 */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastContext;