import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import "../styles/login.css";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(credentials.username, credentials.password);
      navigate("/dashboard");
    } catch {
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-white/10 backdrop-blur-xs flex items-center justify-center">
      <div className="slide-in glass-morphism rounded-3xl p-8 space-y-4 relative z-10 max-w-md w-full">
          <div className="flex justify-center select-none">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Sysone Logo" 
                className="w-30 h-30 floating-orb drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-purple-600 rounded-full opacity-30 blur-md"></div>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-gradient text-4xl md:text-5xl font-extrabold select-none leading-tight">
              Sysone Task Manager
            </h1>
            <p className="text-white/80 mt-4 text-lg font-medium">
              시스원 프로젝트 관리 시스템
            </p>
          </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2 text-md">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="loginBtn"
                placeholder="아이디"
                value={credentials.username}
                onChange={handleInputChange}
              />
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="loginBtn"
                placeholder="비밀번호"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative w-full hover:inset-shadow-sm hover:inset-shadow-black/35 hover: duration-150 flex justify-center p-4 border border-transparent text-lg font-bold rounded-4xl text-white focus:outline-none bg-green-400"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
