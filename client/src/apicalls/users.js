import { axiosInstance } from "./axiosInstance";

//register user
export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//login user

export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (error) {
    throw new Error("An error occurred during login. Please try again.");
  }
};

//get-current-user

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-current-user");
    return response.data;
  } catch (error) {
    return error.message;
  }
};


//get all users

export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-users");
    return response.data;
  } catch (error) {
    return error.message;
  }
}


//forgot-password
export const ForgotPasswords = async (email) => {
  try {
    const response = await axiosInstance.post('api/users/forgot-password', {email});
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

//update user status
export const UpdateUserStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/api/users/update-user-status/${id}`,{status});
  return response.data;
  } catch (error) {
    return error.message;
  }
}