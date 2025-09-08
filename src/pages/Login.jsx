import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="space-y-6 border-white rounded-md p-4">
        <div className="flex justify-center select-none">
          <img 
            src="/logo.png" 
            alt="Sysone Logo" 
            className="w-30 h-30"
          />
        </div>
        <div className="mt-4 text-center text-5xl font-extrabold select-none">
          <span className="text-white">S</span>
          <span className="text-white">ysone</span>
          <span className="text-white"> T</span>
          <span className="text-white">ask</span>
          <span className="text-white"> M</span>
          <span className="text-white">anager</span>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-2 text-md">
            <div>
              <label htmlFor="username" className="sr-only">
                아이디
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none bg-gray-50 relative block w-full px-3 py-5 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10"
                placeholder="아이디"
                value={credentials.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none bg-gray-50 relative block w-full px-3 py-5 placeholder-gray-500 rounded-md text-gray-900 focus:outline-none focus:z-10"
                placeholder="비밀번호"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative w-full flex justify-center p-4 border border-transparent text-lg font-bold rounded-md text-white focus:outline-none bg-green-400"
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
