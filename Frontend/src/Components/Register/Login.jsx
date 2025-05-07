import React, { useContext, useEffect, useState } from "react";
import Signup from "./Signup";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./styles/Signin.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
const Login = () => {
  const [loading, setLoading] = useState(false);
  // Navigate for page change
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  // Function to handle login
  const Signin = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    setLoading(true);

    if (data.login_type === "patient") {
      await axios
        .post(`${import.meta.env.VITE_API_BACKEND}/auth/signin`, userInfo, {
          withCredentials: true,
        })
        .then((response) => {
          // console.log(response);
          toast.success("Login Successfull!");

          localStorage.setItem(
            "FastMed",
            JSON.stringify({
              _id: response.data._id,
              name: response.data.name,
              email: response.data.email,
              user_type: response.data.user_type,
            })
          );
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          toast.warn(error.response.data.message);
        });
    } else if (data.login_type === "doctor") {
      await axios
        .post(`${import.meta.env.VITE_API_BACKEND}/doctor/login`, userInfo, {
          withCredentials: true,
        })
        .then((response) => {
          toast.success("Login Successfull!");

          localStorage.setItem(
            "FastMed",
            JSON.stringify({
              _id: response.data._id,
              name: response.data.name,
              email: response.data.email,
              user_type: response.data.user_type,
            })
          );
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          toast.warn(error.response.data.message);
        });
    } else if (data.login_type === "hospital") {
      await axios
        .post(`${import.meta.env.VITE_API_BACKEND}/hospital/login`, userInfo, {
          withCredentials: true,
        })
        .then((response) => {
          toast.success("Login Successfull!");

          localStorage.setItem(
            "FastMed",
            JSON.stringify({
              _id: response.data._id,
              name: response.data.name,
              email: response.data.email,
              user_type: response.data.user_type,
            })
          );
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          toast.warn(error.response.data.message);
        });
    } else {
      // Redirect to admin dashboard
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div
        className="flex justify-center items-center h-screen"
        id="_signin_page"
      >
        <div className="card w-96 bg-emerald-500 card-xl shadow-sm border-8 border-white rounded-4xl">
          <div className="card-body">
            <div className="grid place-items-center">
              <h3 className="font-bold text-5xl mb-8 text-white">Login</h3>

              <div>
                <form onSubmit={handleSubmit((data) => Signin(data))}>
                  {/* Login Type */}
                  <div className="mydict mb-1">
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="login_type"
                          value="patient"
                          // requried
                          {...register("login_type", { required: true })}
                        />
                        <span>Patient</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="login_type"
                          value="doctor"
                          required
                          {...register("login_type", { required: true })}
                        />
                        <span>Doctor</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="login_type"
                          value="hospital"
                          required
                          {...register("login_type", { required: true })}
                        />
                        <span>Hospital</span>
                      </label>
                    </div>
                  </div>

                  {/* Email */}
                  <input
                    className="input validator w-full my-1 bg-emerald-100 placeholder-emerald-950 text-black"
                    type="email"
                    required
                    placeholder="mail@site.com"
                    {...register("email", { required: true })}
                  />

                  {/* Password */}
                  <input
                    type="password"
                    className="input validator w-full my-1 bg-emerald-100 placeholder-emerald-950 text-black"
                    required
                    placeholder="Password"
                    {...register("password", { required: true })}
                  />

                  {/* Login Button */}
                  <div className="flex items-center justify-center mt-7">
                    {loading ? (
                      <span className="loading loading-dots loading-xl "></span>
                    ) : (
                      <button className="btn bg-emerald-100 text-emerald-950 border-0 hover:text-white hover:bg-transparent hover:border-1 hover:border-white">
                        Login
                      </button>
                    )}
                  </div>
                </form>

                {/* Divider */}
                <div className="flex w-full flex-col">
                  <div className="divider text-white">OR</div>
                  <div className="flex h-10 justify-center items-center text-white">
                    Don't have an Account? &nbsp;{" "}
                    <a
                      className="link text-emerald-950 hover:text-purple-50"
                      href="signup"
                    >
                      Signup
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
