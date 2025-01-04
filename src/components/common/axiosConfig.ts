import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://select-skill-set-backend.vercel.app",

  headers: {
    "Content-Type": "application/json",
  },
});

//  const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000",

//   headers: {
//     "Content-Type": "application/json",
//   },
// });

axiosInstance.interceptors.request.use(
  (config) => {
    const interviewerToken = sessionStorage.getItem("interviewerToken");
    const candidateToken = sessionStorage.getItem("candidateToken");
    const corporateToken = sessionStorage.getItem("corporateToken");

    let token;
    if (interviewerToken) {
      token = interviewerToken;
    } else if (candidateToken) {
      token = candidateToken;
    } else if (corporateToken) {
      token = corporateToken;
    }

    if (token) {
      config.headers["Authorization"] = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
