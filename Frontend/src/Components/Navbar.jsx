import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
const Navbar = () => {
  const ref = useRef(null);
  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Navigate for page change
  const navigate = useNavigate();

  // States
  const [isLogin, setisLogin] = useState(false);
  const [userType, setUserType] = useState("");

  // fetching local storage data and parsing it to fetch the user name
  const storedValue = localStorage.getItem("FastMed");
  const UserData = JSON.parse(storedValue);

  useEffect(() => {
    const fetchJWT = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BACKEND}/auth/jwt`, {
          withCredentials: true,
        });
        // console.log(response.data);
        setUserType(response.data.role);
        setisLogin(true);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchJWT();
  }, []);

  const Logout = async () => {
    const userInfo = {};
    await axios.post(`${import.meta.env.VITE_API_BACKEND}/auth/logout`, userInfo, {
      withCredentials: true,
    });
    setisLogin(false);
    setUserType("");
    toast.success("Logout Successfull!");
    navigate("/");
  };

  return (
    <div>
      <div className="navbar bg-emerald-500 shadow-sm ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {userType == "admin" && (
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              )}

              {userType == "hospital" && (
                <li>
                  <Link to="/hospital/admin">Admin</Link>
                </li>
              )}

              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="#" onClick={handleClick}>
                  Book Appointment
                </Link>
              </li>

              <li>
                {userType == "patient" && (
                  <Link to="/view_appointment">View Appointments</Link>
                )}
                {userType == "doctor" && (
                  <Link to="/view_my_appointments">My Appointments</Link>
                )}
              </li>
            </ul>
          </div>
          <Link
            to="/"
            className="btn btn-active btn-accent bg-emerald-500 text-xl text-white border-0"
          >
            FastMed
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-white ">
            {userType == "admin" && (
              <li>
                <Link
                  className="active:bg-emerald-100 active:text-emerald-500"
                  to="/admin"
                >
                  Admin
                </Link>
              </li>
            )}

            {userType == "hospital" && (
              <li>
                <Link
                  className="active:bg-emerald-100 active:text-emerald-500"
                  to="/hospital/admin"
                >
                  Admin
                </Link>
              </li>
            )}

            <li>
              <Link
                className="active:bg-emerald-100 active:text-emerald-500"
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="active:bg-emerald-100 active:text-emerald-500"
                to="#"
              >
                Book Appointment
              </Link>
            </li>

            <li>
              {userType == "patient" && (
                <Link
                  className="active:bg-emerald-100 active:text-emerald-500"
                  to="/view_appointment"
                >
                  View Appointments
                </Link>
              )}
              {userType == "doctor" && (
                <Link
                  className="active:bg-emerald-100 active:text-emerald-500"
                  to="/view_my_appointments"
                >
                  My Appointments
                </Link>
              )}
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {isLogin ? (
            <div className="dropdown dropdown-left">
              <div
                tabIndex={0}
                role="button"
                className="btn bg-emerald-100 text-emerald-950 border-0 hover:text-white hover:bg-transparent hover:border-1 hover:border-white"
              >
                <div className="flex justify-center items-center">
                  {userType == "doctor" && "Dr. "} {UserData.name}
                  <IoIosArrowDown />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm w-max max-w-screen" // Modified classes
              >
                <li>
                  <a href="">
                    <div className="flex items-center space-x-2">
                      <div>
                        <FaUserCircle className="h-8 w-8" />
                      </div>
                      <div>
                        <div>
                          {userType == "doctor" && "Dr. "}
                          {UserData.name}
                        </div>
                        <div className="text-sm">{UserData.email}</div>
                      </div>
                    </div>
                  </a>
                </li>
                <div className="divider m-0 p-0"></div>

                {userType == "doctor" && (
                  <li>
                    <Link to="/doctor_profile">Profile</Link>
                  </li>
                )}
                {userType == "patient" && (
                  <li>
                    <Link to="/user_profile">Profile</Link>
                  </li>
                )}
                <li>
                  <Link to="/" onClick={Logout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              className="btn bg-emerald-100 text-emerald-950 border-0 hover:text-white hover:bg-transparent hover:border-1 hover:border-white"
              to="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
