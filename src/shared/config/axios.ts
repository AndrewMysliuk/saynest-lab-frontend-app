import axios from "axios"

const baseURL = "http://localhost:3001"

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return await Promise.reject(error.response)
  }
)

export { axiosInstance as axios }
