import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaHospitalSymbol } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { IoIosPaper } from "react-icons/io";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";

const Adminlayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    // console.log("isSidebarOpen: ", isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Navbar />
      <div className="w-screen py-3 grid grid-cols-3 gap-0 border-y-2 border-emerald-500">
        <div className="col-span-1 flex items-center pl-5">
          <button className={`block md:hidden`} onClick={toggleSidebar}>
            <GiHamburgerMenu className=" text-black h-7 w-7 cursor-pointer" />
          </button>
        </div>
        <div className="col-span-1">
          <h1 className="text-5xl text-black text-center font-extrabold">
            ADMIN
          </h1>
        </div>
      </div>

      <div className="h-full bg-white grid grid-cols-5 gap-0">
        {/* Sidebar Code */}
        <div
          className={`sticky top-0 transition-transform duration-300 bg-emerald-50  ${
            isSidebarOpen
              ? "col-span-5 h-screen"
              : "hidden md:block col-span-1 "
          }`}
        >
          <div className=" text-center">
            <span className="text-black">Sidebar</span>
          </div>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center mt-2 border-2 rounded mx-3 p-2 cursor-pointer transition-all duration-300 ease-in-out 
               ${
                 isActive
                   ? " bg-emerald-500 text-white border-white scale-105 shadow-md"
                   : "text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-white hover:scale-105 hover:shadow-md"
               }`
            }
          >
            <MdSpaceDashboard className="w-9 h-9" />
            <span className="pl-1 font-bold">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/addhospital"
            className={({ isActive }) =>
              `flex items-center mt-2 border-2 rounded mx-3 p-2 cursor-pointer transition-all duration-300 ease-in-out 
             ${
               isActive
                 ? " bg-emerald-500 text-white border-white scale-105 shadow-md"
                 : "text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-white hover:scale-105 hover:shadow-md"
             }`
            }
          >
            <FaHospitalSymbol className="w-9 h-9" />
            <span className="pl-1 font-bold">Add Hospitals</span>
          </NavLink>

          <NavLink
            to="/admin/doctors"
            className={({ isActive }) =>
              `flex items-center mt-2 border-2 rounded mx-3 p-2 cursor-pointer transition-all duration-300 ease-in-out 
             ${
               isActive
                 ? " bg-emerald-500 text-white border-white scale-105 shadow-md"
                 : "text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-white hover:scale-105 hover:shadow-md"
             }`
            }
          >
            <FaUserDoctor className="w-9 h-9" />
            <span className="pl-1 font-bold">Doctors</span>
          </NavLink>

          <NavLink
            to="/admin/all_appointments"
            className={({ isActive }) =>
              `flex items-center mt-2 border-2 rounded mx-3 p-2 cursor-pointer transition-all duration-300 ease-in-out 
             ${
               isActive
                 ? " bg-emerald-500 text-white border-white scale-105 shadow-md"
                 : "text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-white hover:scale-105 hover:shadow-md"
             }`
            }
          >
            <IoIosPaper className="w-9 h-9" />
            <span className="pl-1 font-bold">All Appointments</span>
          </NavLink>
          <NavLink
            to="/admin/contact_messages"
            className={({ isActive }) =>
              `flex items-center mt-2 border-2 rounded mx-3 p-2 cursor-pointer transition-all duration-300 ease-in-out 
             ${
               isActive
                 ? " bg-emerald-500 text-white border-white scale-105 shadow-md"
                 : "text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-white hover:scale-105 hover:shadow-md"
             }`
            }
          >
            <BiSolidMessageRoundedDetail className="w-9 h-9" />
            <span className="pl-1 font-bold">Messages</span>
          </NavLink>

          
        </div>

        {/* Content Goes Here */}
        <div
          className={`${
            isSidebarOpen ? "hidden md:col-span-5" : "md:col-span-4 col-span-5"
          }`}
        >
          {/* <span className="text-black">Content</span> */}
          <div className="min-h-screen">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Adminlayout;
