import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageNotFound from "../PageNotFound";
const ProtectedRoutes = ({ element, allowedRoles }) => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJWT = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BACKEND}/auth/jwt`, {
          withCredentials: true,
        });
        setUserType(response.data.role);
        setIsUserLogin(true);
        if (!allowedRoles.includes(response.data.role)) {
          navigate("/page_not_found");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchJWT();
  }, [isUserLogin, userType, allowedRoles, navigate]);

  return isUserLogin && allowedRoles.includes(userType) ? element : <PageNotFound/>;
};

export default ProtectedRoutes;
