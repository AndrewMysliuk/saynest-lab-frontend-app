import axios from "axios"

const baseURL = import.meta.env.VITE_API_CORE_URL ?? ""

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
