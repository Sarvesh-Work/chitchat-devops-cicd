import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "../redux/reducers/authReducer";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

const useMutationHoot = (api) => {
  const [loading, setLoading] = useState(false);
  const [method] = api();

  const [data, setData] = useState(null);

  const executeFunction = async (message = "Loading", ...args) => {
    setLoading(true);
    const toastId = toast.loading(message);

    try {
      const res = await method(...args);
      const data = res?.data;
      const errorMessage = res?.error?.data?.message || "An error occurred";

      if (data) {
        toast.success(data?.message, { id: toastId });
        setData(data);
      } else {
        toast.error(errorMessage, { id: toastId });
      }
    } catch (error) {
      toast.error("Unexpected error occurred", { id: toastId });
      console.error("Error in executeFunction:", error);
    } finally {
      setLoading(false);
    }
  };

  return [executeFunction, loading, data];
};

const useAuth = (api) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const executeFunction = async (message = "Loading...", ...args) => {
    setLoading(true);
    const toastId = toast.loading(message);

    try {
      const response = await api(...args);

      if (response?.userProfile) {
        dispatch(setUser(response.userProfile));
        toast.success(response.message || "Login successful!", {
          id: toastId,
        });
      } else {
        dispatch(clearUser());
        toast.error("User data not found", { id: toastId });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Unexpected error occurred";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return [executeFunction, loading];
};

export { useAuth, useErrors, useMutationHoot };
