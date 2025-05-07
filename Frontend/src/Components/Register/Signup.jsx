import React, { useState } from "react";
import Login from "./Login";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "cally";
import "./styles/Signup.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";

const Signup = () => {
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

  const Signup = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_BACKEND}/auth/signup`, data);
      toast.success("User registered successfully");
      // alert("User registered successfully");
      reset();
      navigate("/login");
    } catch (error) {
      reset({
        email: "",
        mobile: "",
      });
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="flex justify-center items-center h-screen"
        id="_signup_page"
      >
        <div className="card w-96 bg-emerald-500 card-xl shadow-sm border-8 border-white rounded-4xl">
          <div className="card-body">
            <div className="grid place-items-center">
              <h3 className="font-bold text-5xl mb-8 text-white">Signup</h3>

              <div>
                <form onSubmit={handleSubmit((data) => Signup(data))}>
                  {/* Full Name */}
                  <input
                    type="input"
                    className="input validator w-full my-1 bg-emerald-100 placeholder-emerald-950 text-black"
                    required
                    placeholder="Full Name"
                    pattern="^[A-Za-z\s]*$"
                    minLength="3"
                    maxLength="80"
                    {...register("name", { required: true })}
                  />
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
                    minLength="8"
                    maxLength="20"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                    {...register("password", { required: true })}
                  />

                  {/* Mobile Number */}
                  <input
                    type="phone"
                    className="input validator w-full my-1 bg-emerald-100 placeholder-emerald-950 text-black"
                    required
                    placeholder="Mobile Number"
                    pattern="^[0-9]+$"
                    minLength="10"
                    maxLength="10"
                    title="Field must contain only numbers"
                    {...register("mobile", { required: true })}
                  />

                  {/* Date of Birth */}
                  <div className="flex items-center my-1 ">
                    <p className="text-lg text-white">Date of Birth: &nbsp;</p>
                    <input
                      type="date"
                      className="input w-9/12 bg-emerald-100 placeholder-emerald-950"
                      placeholder="Date of Birth"
                      max={new Date().toISOString().split("T")[0]}
                      required
                      {...register("dob", { required: true })}
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex justify-center items-center mt-1 text-white">
                    <div className="flex justify-center items-center ">
                      <p className="text-lg"> Male &nbsp;</p>
                      <input
                        type="radio"
                        name="radio-4"
                        className="radio radio-primary"
                        value="male"
                        required
                        {...register("gender", { required: true })}
                      />
                    </div>
                    <span className=" divider text-4xl">&nbsp;</span>
                    <div className="flex justify-center items-center">
                      <p className="text-lg">&nbsp;Female &nbsp;</p>
                      <input
                        type="radio"
                        name="radio-4"
                        className="radio radio-secondary"
                        value="female"
                        required
                        {...register("gender", { required: true })}
                      />
                    </div>
                  </div>

                  {/* Signup Button */}
                  <div className="flex items-center justify-center mt-2">
                    {loading ? (
                      <span className="loading loading-dots loading-xl "></span>
                    ) : (
                      <button className="btn bg-emerald-100 text-emerald-950 border-0 w-full hover:text-white hover:bg-transparent hover:border-1 hover:border-white">
                        Signup
                      </button>
                    )}
                  </div>
                </form>

                {/* Divider */}
                <div className="flex w-full flex-col ">
                  <div className="divider text-white">OR</div>
                  <div className="flex h-10 justify-center items-center text-white">
                    have an Account? &nbsp;{" "}
                    <a
                      className="link text-emerald-950 hover:text-purple-50"
                      href="/login"
                    >
                      Login
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

export default Signup;
