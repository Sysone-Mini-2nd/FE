import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/authAPI';
/** 작성자: 김대호 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 새로고침 시 로컬 스토리지에서 사용자 정보와 토큰 확인
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    
    if (savedUser && savedToken && savedRefreshToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // API 호출
      const response = await apiLogin(username, password);
      
      // API 응답에서 데이터 추출
      const { data } = response;
      
      // 토큰 저장
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // 사용자 정보 구성
      const loggedInUser = {
        id: data.userId,
        accountId: data.accountId,
        name: data.name,
        email: data.email,
        role: data.role,
        position: data.position,
        picUrl: data.picUrl,
        avatar: data.name ? data.name.charAt(0) : username.charAt(0)
      };
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await apiLogout();
    } catch (error) {
      console.error('서버 로그아웃 실패:', error);
      // 서버 로그아웃 실패해도 클라이언트 측 로그아웃은 진행
    } finally {
      // 클라이언트 측 정리 (항상 실행)
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
