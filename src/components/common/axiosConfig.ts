import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const interviewerToken = localStorage.getItem("interviewerToken");
    const candidateToken = localStorage.getItem("candidateToken");
    const corporateToken = localStorage.getItem("corporateToken");

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
