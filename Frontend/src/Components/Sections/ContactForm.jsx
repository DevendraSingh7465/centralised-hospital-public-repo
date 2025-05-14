import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
const ContactForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  const SendContactMessage = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/admin/send`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Message sent successfully!");
      reset();
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BACKEND}/mail/contact`,
          data
        );
      } catch (error) {
        console.log("Error Sending mail:", error);
      }
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Message not Sent!");
    }
  };
  return (
    <div className=" p-4 mt-10">
      <div className="min-h-10/12 ">
        <div className="hero min-h-[60vh]">
          <div className="hero-content flex-col lg:flex-row rounded-3xl shadow w-8/12 sm:w-11/12 md:w-10/12 lg:w-8/12 bg-gradient-to-l from-emerald-100 via-emerald-100 to-transparent via-transparent">
            <img
              src="./contact-form.png"
              className="w-auto h-[60vh] mr-10 hidden sm:block"
            />
            <div className="ml-5">
              <h1 className="text-5xl font-bold font-mono">Contact Us!</h1>
              <form onSubmit={handleSubmit((data) => SendContactMessage(data))}>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    What is your name?
                  </legend>
                  <input
                    type="text"
                    className="input "
                    placeholder="Type here"
                    pattern="[A-Za-z\s]*"
                    required
                    {...register("name", { required: true })}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    What is your email?
                  </legend>
                  <input
                    type="email"
                    className="input"
                    placeholder="example@mail.com"
                    required
                    {...register("email", { required: true })}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Your Message</legend>
                  <textarea
                    className="textarea h-24"
                    placeholder="Type Here"
                    required
                    {...register("message", { required: true })}
                  ></textarea>
                </fieldset>
                <button className="btn bg-indigo-600 text-white hover:text-indigo-600 hover:border-1 hover:border-indigo-600 hover:bg-white mt-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
