import { createContext, useState, useEffect } from 'react';
import { membersData } from '../data/employees';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 새로고침 시 로컬 스토리지에서 사용자 정보 확인
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // 회원 데이터에서 계정 정보 찾기
    const member = membersData.find(
      m => m.account_id === username && m.password === password && m.is_deleted === 0
    );
    
    if (member) {
      // 로그인 성공 - 마지막 로그인 시간 업데이트
      const loggedInUser = {
        ...member,
        department: member.id === 5 ? "DX사업부" : "일반부서", // 김대호만 DX사업부
        avatar: member.name.charAt(0)
      };
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
