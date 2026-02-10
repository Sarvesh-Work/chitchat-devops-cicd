import { Button, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import AvatarUpload from "../components/Shared/AvatarUpload";
import { mainColor } from "../constants/constants";
import { handleAvatarChange } from "../lib/features";
import { signUpApi } from "../redux/apis/authApi";
import { setUser } from "../redux/reducers/authReducer";

function SignUp({ handleLogin }) {
  const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [avatarPath, setAvatarPath] = useState("");

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("avatar", data.photo[0]);
    formData.append("name", data.name);
    formData.append("password", data.password);
    formData.append("email", data.email);
    formData.append("bio", data.bio);
    formData.append("username", data.username);

    const toastId = toast.loading("Creating user");

    try {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await signUpApi(formData, config);
      dispatch(setUser(response.userProfile));
      toast.success(response.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Error during signUp:", error);
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          marginTop: "1rem",
          fontWeight: "600",
          width: "100%",
        }}
      >
        Create a new account
      </Typography>

      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <AvatarUpload
          avatarPath={avatarPath}
          setAvatarPath={setAvatarPath}
          handleAvatarChange={handleAvatarChange}
          register={register}
          errors={errors}
        />
        <TextField
          label="Name"
          fullWidth
          sx={{ marginTop: "1rem" }}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <div style={{ color: mainColor }}>{errors.name.message}</div>
        )}
        <TextField
          label="Username"
          fullWidth
          sx={{ marginTop: "15px" }}
          {...register("username", {
            required: "Username is required",
            pattern: { value: /^[a-zA-Z0-9]{6,}$/ },
          })}
        />
        {errors.username && (
          <div style={{ color: mainColor }}>
            {errors.username.message || (
              <div>
                - It allows lowercase letters (a-z). <br />
                - It allows uppercase letters (A-Z). <br />
                - It allows numbers (0-9). <br />
                - It enforces a minimum length of 6 characters. <br />- It does
                not allow special characters, spaces, or hyphens.
              </div>
            )}
          </div>
        )}
        <TextField
          label="Email"
          fullWidth
          sx={{ marginTop: "15px" }}
          {...register("email", {
            required: "Email is required",
            pattern: { value: emailValidation },
          })}
        />
        {errors.email && (
          <div style={{ color: mainColor }}>
            {errors.email.message || "Email is not valid"}
          </div>
        )}
        <TextField
          label="Bio"
          fullWidth
          multiline
          maxRows={3}
          sx={{ marginTop: "10px" }}
          {...register("bio", { required: "Bio is required" })}
        />
        {errors.bio && (
          <div style={{ color: mainColor }}>{errors.bio.message}</div>
        )}
        <TextField
          label="Password"
          fullWidth
          sx={{ marginTop: "15px" }}
          type="password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
            },
          })}
        />
        {errors.password && (
          <div style={{ color: mainColor }}>
            {errors.password.message || (
              <div>
                - At least 8 characters <br />
                - Must contain at least 1 uppercase letter <br />
                - 1 lowercase letter, and 1 number <br />
                - Can contain special characters No space in word <br />
              </div>
            )}
          </div>
        )}
        <TextField
          label="Confirm password"
          fullWidth
          sx={{ marginTop: "15px" }}
          type="password"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value, formValue) =>
              value === formValue.password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <div style={{ color: mainColor }}>
            {errors.confirmPassword.message}
          </div>
        )}

        <Button
          sx={{
            marginTop: "2rem",
            bgcolor: mainColor,
            "&:hover": {
              bgcolor: mainColor,
            },
          }}
          fullWidth
          type="submit"
          variant="contained"
        >
          Sign up
        </Button>
        <Typography
          sx={{
            color: "#797C8B",
            marginTop: "10px",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={handleLogin}
            style={{ color: mainColor, fontWeight: "600", cursor: "pointer" }}
          >
            Login
          </span>
        </Typography>
      </form>
    </>
  );
}

SignUp.propTypes = {
  handleLogin: PropTypes.func,
};

export default SignUp;
