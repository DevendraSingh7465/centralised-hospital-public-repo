import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const DoctorAppointmentsLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs text-sm ">
          <ul className="">
            <li className="">Doctor</li>
            <li className="">My Appointments</li>
          </ul>
        </div>
        <div className=" w-1/2 flex flex-wrap justify-start items-center">
          <NavLink
            to={`todays_appointments`}
            className={({ isActive }) =>
              `flex items-center mt-2 mx-1 border-b-1 p-2 cursor-pointer transition-all duration-300 ease-in-out 
                           ${
                             isActive
                               ? "text-emerald-500 border-emerald-500"
                               : "hover:text-emerald-500 hover:border-emerald-500"
                           }`
            }
          >
            <span className="pl-1 font-bold">Today's Appointments</span>
          </NavLink>
          <NavLink
            to={`pending_requests`}
            className={({ isActive }) =>
              `flex items-center mt-2 mx-1 border-b-1 p-2 cursor-pointer transition-all duration-300 ease-in-out 
            ${
              isActive
                ? "text-emerald-500 border-emerald-500"
                : "hover:text-emerald-500 hover:border-emerald-500"
            }`
            }
          >
            <span className="pl-1 font-bold">Pending Requests</span>
          </NavLink>
          <NavLink
            to={`all`}
            className={({ isActive }) =>
              `flex items-center mt-2 mx-1 border-b-1 p-2 cursor-pointer transition-all duration-300 ease-in-out 
            ${
              isActive
                ? "text-emerald-500 border-emerald-500"
                : "hover:text-emerald-500 hover:border-emerald-500"
            }`
            }
          >
            <span className="pl-1 font-bold">All Appointments</span>
          </NavLink>
        </div>

        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default DoctorAppointmentsLayout;
