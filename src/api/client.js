// import axios from 'axios';

// // axios 인스턴스 생성
// const api = axios.create({
//   baseURL: '/api', 
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
//   withCredentials: false, // CORS 설정
// });

// // 요청 인터셉터
// api.interceptors.request.use(
//   (config) => {
//     // 토큰
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:8081/api"  // 로컬 백엔드 URL
  : "https://api.sysonetaskmanager.store/api";  // 프로덕션 백엔드 URL

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // CORS 설정
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 토큰
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;