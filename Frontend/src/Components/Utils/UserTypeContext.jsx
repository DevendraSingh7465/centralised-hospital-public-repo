import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = (props) => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [userType, setUserType] = useState("");
  useEffect(() => {
    const fetchJWT = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/auth/jwt`, {
          withCredentials: true,
        });
        setUserType(response.data.role);
        setIsUserLogin(true);
        // console.log("isUserLogin setted to: true");
        // console.log("user type setted to:", response.data.role);
      } catch (error) {
        console.log("User is not LoggedIn");
      }
    };
    fetchJWT();
  }, [isUserLogin]);
  return (
    <UserContext.Provider
      value={{ userType, isUserLogin, setIsUserLogin, setUserType }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
