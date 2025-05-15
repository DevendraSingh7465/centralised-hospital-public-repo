import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidMessageDots } from "react-icons/bi";
import { RiEditBoxFill } from "react-icons/ri";
import { MdOutlineClear } from "react-icons/md";

const HospitalDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [branches, setBranches] = useState([]);

  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [selectedDoctors, setSelectedDoctors] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patients);

  const handleDoctorChange = (e) => {
    setSelectedDoctors(e);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e);
  };

  useEffect(() => {
    let result = [...patients];

    // Filter by Doctor
    if (selectedDoctors) {
      result = result.filter(
        (patient) => patient.doctor_name === selectedDoctors
      );
    }

    // Filter by Branch
    if (selectedBranch) {
      result = result.filter((patient) => patient.branch === selectedBranch);
    }

    // Filter by Name
    if (searchQuery) {
      result = result.filter((patient) =>
        patient.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPatients(result);
  }, [selectedDoctors, selectedBranch, searchQuery, patients]);

  // Fetching Hospital Branches
  const fetchHospitalBranches = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/hospital/fetchHospitalBranches`,
        {
          withCredentials: true,
        }
      );
      setBranches(response.data);
      // console.log("Hospital Branches: ", response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching Branches");
    }
  };

  // Fetching Hospital Doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/hospital/getDoctors`,
        {
          withCredentials: true,
        }
      );
      setDoctors(response.data);
      // console.log("Hospital Doctors: ", response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching doctors");
    }
  };
  // Fetching Hospital Patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/hospital/fetchPatients`,
        {
          withCredentials: true,
        }
      );
      setPatients(response.data);
      // console.log("Hospital Patients: ", response.data);

      if (response.data.length % 10 == 0) {
        setPagesCount(response.data.length / 10);
      } else {
        const set_page_count = Math.floor(response.data.length / 10);
        setPagesCount(set_page_count + 1);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching patients");
    }
  };

  useEffect(() => {
    fetchHospitalBranches();
    fetchDoctors();
    fetchPatients();
  }, []);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredPatients.slice(firstPostIndex, lastPostIndex);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const previosPage = () => {
    setCurrentPage(currentPage - 1);
  };

  function formatDate(date) {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString().split("T")[0];
    return formattedDate;
  }

  function formatTime(time) {
    const dateObj = new Date(time);
    const extractedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return extractedTime;
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
  return (
    <div className=" p-2 ">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="text-emerald-500">Dashboard</li>
        </ul>
      </div>

      {/* stats */}
      <div className="stats stats-vertical sm:stats-horizontal md:stats-horizontal lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Doctors</div>
          <div className="stat-value">{doctors.length}</div>
          <div className="stat-desc">From all branches</div>
        </div>

        <div className="stat">
          <div className="stat-title">Patients</div>
          <div className="stat-value">{patients.length}</div>
          <div className="stat-desc">Registrations</div>
        </div>

        <div className="stat">
          <div className="stat-title">Branches</div>
          <div className="stat-value">{branches.length}</div>
          <div className="stat-desc">Total</div>
        </div>
      </div>

      {/* Page */}
      {currentPosts.length != 0 ? (
        <section className="text-black">
          {/* Heading */}
          <div className="flex justify-start items-center">
            <h1 className="text-2xl font-bold py-3">Patients Appointments</h1>
          </div>

          <div className="p-2 flex">
            {/* Search */}
            <div className="flex justify-center items-center">
              <label className="input">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input
                  type="search"
                  className="grow"
                  placeholder="Search Patient"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </label>
            </div>

            {/* Branches */}
            <div>
              <select
                className="btn px-2 mx-1 bg-indigo-400 text-white"
                name="select branch"
                onChange={(e) => handleBranchChange(e.target.value)}
              >
                <option value="" className="bg-white text-black">
                  Select Branch
                </option>
                {branches.map((branch) => (
                  <option
                    key={branch._id}
                    value={branch.branch}
                    className="bg-white text-black text-center"
                  >
                    {branch.branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Doctor */}
            <div>
              <select
                name="select doctor"
                className="btn px-2 mx-1 bg-emerald-500 text-white"
                onChange={(e) => handleDoctorChange(e.target.value)}
              >
                <option className="text-black bg-white">Select Doctor</option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor._id}
                    value={doctor.name}
                    className="text-black bg-white"
                  >
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <a
                href="/hospital/admin/dashboard"
                className="btn bg-red-400 text-white"
              >
                <MdOutlineClear />
              </a>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-box text-black ">
            <table className="table text-black border-b-2 border-green-200">
              {/* head */}
              <thead>
                <tr className="text-black bg-green-50">
                  <th>Visit Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Patient</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {currentPosts.map((appointment, index) => (
                  <tr key={appointment._id}>
                    <td>{formatDate(appointment.appointment)}</td>
                    <td>{formatTime(appointment.appointment)}</td>
                    <td>{appointment.doctor_name}</td>
                    <td>{appointment.patient_name}</td>
                    <td>{calculateAge(appointment.dob)}</td>
                    <td>{appointment.gender}</td>

                    {appointment.status == "Cancelled" && (
                      <td>
                        <div className=" flex justify-start items-center">
                          <div className="text-red-600 bg-red-300 px-2 rounded-2xl">
                            Cancelled
                          </div>
                        </div>
                      </td>
                    )}
                    {appointment.status == "Confirmed" && (
                      <td>
                        <div className="flex justify-start items-center">
                          <div className="text-green-600 bg-green-100 px-2 rounded-2xl ">
                            {appointment.status}
                          </div>
                        </div>
                      </td>
                    )}
                    {appointment.status === "Not accepted" && (
                      <td>
                        <div className="flex justify-start items-center">
                          <div className="text-yellow-600 bg-yellow-100 px-2 rounded-2xl ">
                            {appointment.status}
                          </div>
                        </div>
                      </td>
                    )}
                    {appointment.status === "Pending" && (
                      <td>
                        <div className="flex justify-start items-center">
                          <div className="text-indigo-500 bg-indigo-100 px-2 rounded-2xl ">
                            Pending
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagesCount > 1 && (
              <div className="p-4">
                <div className="join">
                  {currentPage == 1 ? (
                    <button
                      disabled
                      className="join-item btn bg-emerald-100"
                    >{`<`}</button>
                  ) : (
                    <button
                      className="join-item btn bg-emerald-100"
                      onClick={() => previosPage()}
                    >{`<`}</button>
                  )}
                  <button className="join-item btn bg-white cursor-default">
                    Page {currentPage} of {pagesCount}
                  </button>
                  {currentPage == pagesCount ? (
                    <button
                      disabled
                      className="join-item btn bg-emerald-100 "
                    >{`>`}</button>
                  ) : (
                    <button
                      className="join-item btn bg-emerald-100 "
                      onClick={() => nextPage()}
                    >{`>`}</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <div class="flex flex-col items-center justify-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-16 h-16 text-gray-400 mb-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.932 3.374h14.74c1.715 0 2.581-1.874 1.932-3.374L12 9.75l-9.303 3.376zm0 0c-.16-.289-.43-.486-.738-.486H3.36c-.308 0-.578.197-.738.486L12 15.75l9.303-3.374c.16.289.43.486.738.486h8.54c.308 0 .578-.197.738-.486L12 9.75M12 15.75l-9.303-3.374"
            />
          </svg>
          <h2 class="text-xl font-semibold text-gray-600 mb-2">
            No Appointments Found
          </h2>
          
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;
