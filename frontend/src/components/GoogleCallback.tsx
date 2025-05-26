import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const username = params.get("username");
    const email = params.get("email");
    const avatarUrl = params.get("avatarUrl");

    if (token && username && email) {
      dispatch(setCredentials({ token, user: { username, email, avatarUrl } }));
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, location.search]);

  return <p>Logging in with Google...</p>;
}
