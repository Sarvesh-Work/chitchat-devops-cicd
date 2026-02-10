import axios from "axios";
import { server } from "../../constants/config";

const apiClient = axios.create({
  baseURL: `${server}/user`,
  withCredentials: true,
});

const fetchUserApi = async () => {
  try {
    const response = await apiClient.get("/verified/profile", {
      validateStatus: () => true,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching profile", error);
    throw error;
  }
};

const loginApi = async ({ UsernameOrEmail, password }, config) => {
  try {
    const response = await apiClient.post(
      "/login",
      { UsernameOrEmail, password },
      config
    );
    return response.data;
  } catch (error) {
    console.log("Error while login", error);
    throw error;
  }
};

const signUpApi = async (formData, config) => {
  try {
    const response = await apiClient.post("/signUp", formData, config);
    return response.data;
  } catch (error) {
    console.log("Error while sign-up", error);
    throw error;
  }
};

const logoutApi = async () => {
  try {
    const response = await apiClient.post("/verified/logout");
    return response.data;
  } catch (error) {
    console.log("Error while logout", error);
    throw error;
  }
};

export { fetchUserApi, loginApi, logoutApi, signUpApi };
