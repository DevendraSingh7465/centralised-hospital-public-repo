import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import DoctorAndHospitalDetails from "./DoctorAndHospitalDetails";

const BookAppointmentLayout = () => {
  // States
  const [doctorID, setDoctorID] = useState("");
  const [doctorName, setDoctorName] = useState("");

  // React Hooks for navigation and state management
  const location = useLocation();

  //   Fetch doctor details from URl
  function fetchDoctorDetails() {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("doctorID");
    const name = searchParams.get("doctorName");
    setDoctorID(id);
    setDoctorName(name);
  }

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs text-sm ">
          <ul className="">
            <li className="">User</li>
            <li className="">Book Appointment</li>
            <li className="text-emerald-500">Dr.{doctorName}</li>
          </ul>
        </div>

        <div className=" w-1/2 flex justify-start items-center">
          <NavLink
            to={`Self?doctorID=${doctorID}&doctorName=${doctorName}`}
            data-tip="Book Appointment for yourself"
            className={({ isActive }) =>
              `tooltip tooltip-right flex items-center mt-2 mx-1 border-b-1 p-2 cursor-pointer transition-all duration-300 ease-in-out 
                           ${
                             isActive
                               ? "text-emerald-500 border-emerald-500"
                               : "hover:text-emerald-500 hover:border-emerald-500 hover:shadow-md"
                           }`
            }
          >
            <span className="pl-1 font-bold">You</span>
          </NavLink>
          <NavLink
            to={`Other?doctorID=${doctorID}&doctorName=${doctorName}`}
            data-tip="Book Appointment for others"
            className={({ isActive }) =>
              `tooltip tooltip-right flex items-center mt-2 mx-1 border-b-1 p-2 cursor-pointer transition-all duration-300 ease-in-out 
            ${
              isActive
                ? "text-emerald-500 border-emerald-500"
                : "hover:text-emerald-500 hover:border-emerald-500 hover:shadow-md"
            }`
            }
          >
            <span className="pl-1 font-bold">Other</span>
          </NavLink>
        </div>

        <Outlet />
        {/* Doctor and Hospital Details */}
        <div>
          <DoctorAndHospitalDetails doctorID={doctorID} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookAppointmentLayout;
