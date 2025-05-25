import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import { jwtDecode } from "jwt-decode";

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = {
          token,
          username: decoded.username,
          email: decoded.email,
        };
        dispatch(setCredentials(user));
        navigate("/home");
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, location.search]);

  return <p>Logging in with Google...</p>;
}
