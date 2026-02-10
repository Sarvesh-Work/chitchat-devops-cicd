import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import sideImage from "../assets/Images/Login-Sign-up Banner.png";
import Loader from "../components/layout/Loader";
import { mainColor } from "../constants/constants";
import { useAuth } from "../hooks/hooks";
import { loginApi } from "../redux/apis/authApi";
import SignUp from "./SignUp";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const handleLoginToggle = () => setIsLogin((prev) => !prev);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, isLoading] = useAuth(loginApi);

  const onSubmit = async (formData) => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    await login("Login...", formData, config);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <Grid container style={{ height: "100vh", display: "flex" }}>
      <Grid
        item
        xs={12}
        md={7}
        style={{
          display: { xs: "none", md: "block" },
          backgroundImage: `url(${sideImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></Grid>
      <Grid item xs={12} md={5} style={{ overflowY: "scroll", height: "100%" }}>
        <Container
          component="main"
          maxWidth="xs"
          style={{ padding: "3rem", display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="h5"
            style={{ fontSize: "25px", fontWeight: 600 }}
          >
            Welcome to
            <div
              style={{ fontSize: "35px", fontWeight: 700, color: mainColor }}
            >
              ChitChat
            </div>
          </Typography>

          {isLogin ? (
            <>
              <Typography
                variant="h5"
                style={{ marginTop: "1rem", fontWeight: 600, width: "100%" }}
              >
                Login to your account
              </Typography>
              <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Username or email"
                  fullWidth
                  style={{ marginTop: "15px" }}
                  {...register("UsernameOrEmail", {
                    required: "Username or email is required",
                  })}
                />
                {errors.UsernameOrEmail && (
                  <div style={{ color: mainColor }}>
                    {errors.UsernameOrEmail.message}
                  </div>
                )}

                <TextField
                  label="Password"
                  fullWidth
                  style={{ marginTop: "15px" }}
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <div style={{ color: mainColor }}>
                    {errors.password.message}
                  </div>
                )}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    ":hover": { backgroundColor: mainColor },
                    mt: "3rem",
                    bgcolor: mainColor,
                  }}
                >
                  Login
                </Button>
                <Typography style={{ color: "#797C8B", marginTop: "10px" }}>
                  {`Don't have an account?`}
                  <span
                    onClick={handleLoginToggle}
                    style={{
                      color: mainColor,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Sign up
                  </span>
                </Typography>
              </form>
            </>
          ) : (
            <SignUp handleLogin={handleLoginToggle} />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;
