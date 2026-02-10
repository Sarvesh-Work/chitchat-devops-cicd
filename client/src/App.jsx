import "bootstrap-icons/font/bootstrap-icons.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Protected from "./components/auth/Protected.jsx";
import Loader from "./components/layout/Loader.jsx";
import SignUp from "./pages/SignUp.jsx";
import { fetchUserApi } from "./redux/apis/authApi.js";
import { clearUser, setUser } from "./redux/reducers/authReducer.js";
import { SocketProvider } from "./socket/socket.jsx";
import "./Style.css";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Groups = lazy(() => import("./pages/Groups.jsx"));
const Messages = lazy(() => import("./pages/messages/Messages.jsx"));
const PageNotFound = lazy(() => import("./pages/PageNotFound.jsx"));
const DetailsPage = lazy(() => import("./pages/DetailsPage"));

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { profile } = await fetchUserApi();
        if (profile) {
          dispatch(setUser(profile));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        dispatch(clearUser());
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      element: (
        <SocketProvider>
          {!loading && <Protected user={!!user} redirect="/login" />}
        </SocketProvider>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/groups", element: <Groups /> },
        { path: "/messages/:id", element: <Messages /> },
        { path: "/groupDetails", element: <DetailsPage /> },
      ],
    },
    {
      element: <Protected user={!user} redirect="/" />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/signUp", element: <SignUp /> },
      ],
    },
    { path: "*", element: <PageNotFound /> },
  ]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        {loading ? <Loader /> : <RouterProvider router={router} />}
      </Suspense>
      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
}

export default App;
