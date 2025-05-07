import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidMessageDots } from "react-icons/bi";
import { RiEditBoxFill } from "react-icons/ri";
const HospitalDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);

  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  const handleBranchChange = (e) => {
    setSelectedBranch(e);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e);
  };
  useEffect(() => {
    let result = [...doctors];

    // Filter by Branch
    if (selectedBranch) {
      result = result.filter((doctor) => doctor.branch === selectedBranch);
    }

    // Filter by Name
    if (searchQuery) {
      result = result.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredDoctors(result);
  }, [selectedBranch, searchQuery, doctors]);

  useEffect(() => {
    const fetchHospitalBranches = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/hospital/fetchHospitalBranches`,
          {
            withCredentials: true,
          }
        );
        setBranches(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching Branches");
      }
    };
    fetchHospitalBranches();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/hospital/getDoctors`,
        {
          withCredentials: true,
        }
      );
      setDoctors(response.data);
      if (response.data.length % 10 == 0) {
        setPagesCount(response.data.length / 10);
      } else {
        const set_page_count = Math.floor(response.data.length / 10);
        setPagesCount(set_page_count + 1);
      }
      // console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredDoctors.slice(firstPostIndex, lastPostIndex);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const previosPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const deleteDoctor = async (id) => {
    console.log("Delete Button Clicked", id);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BACKEND}/doctor/deleteDoctor/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Doctor deleted successfully");
      fetchDoctors();
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting doctor");
    }
  };
  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="text-emerald-500">Doctors</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        {/* Heading */}
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Doctors</h1>
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
                placeholder="Search Doctor"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </label>
          </div>

          {/* Branches */}
          <div className="px-2">
            <select
              name="Select Branch"
              className="btn btn-outline btn-primary appearance-none"
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
          <div className="flex justify-center items-center">
            <Link
              to="/hospital/admin/adddoctor"
              className="btn bg-emerald-50 border-emerald-500 border-2 text-emerald-500 hover:bg-emerald-500 hover:text-white"
            >
              Add Doctor
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box text-black ">
          <table className="table text-black border-b-2 border-green-200">
            {/* head */}
            <thead>
              <tr className="text-black bg-green-50">
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Branch</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {currentPosts.map((doctors, index) => (
                <tr key={doctors._id}>
                  <th>{index + 1}</th>
                  <td>{doctors.name}</td>
                  <td>{doctors.email}</td>
                  <td>{doctors.city}</td>
                  <td>{doctors.branch}</td>
                  <td className="flex justify-start items-center ">
                    <div className="">
                      <Link
                        className="tooltip w-6 h-6"
                        data-tip="Details"
                        to={`/hospital/admin/doctor_profile?doctorId=${doctors._id}&doctorName=${doctors.name}`}
                      >
                        <BiSolidMessageDots className=" w-5 h-5 text-indigo-500 cursor-pointer hover:w-6 hover:h-6 transition-all duration-300 ease-in-out" />
                      </Link>
                      <Link
                        className="tooltip w-6 h-6"
                        data-tip="Edit"
                        to={`/hospital/admin/editDoctor?doctorId=${doctors._id}&doctorName=${doctors.name}`}
                      >
                        <RiEditBoxFill className="w-5 h-5 text-emerald-500 cursor-pointer hover:w-6 hover:h-6 transition-all duration-300 ease-in-out" />
                      </Link>
                      <Link
                        className="tooltip w-6 h-6"
                        data-tip="Delete"
                        onClick={(data) => deleteDoctor(doctors._id)}
                      >
                        <RiDeleteBin6Line className="w-5 h-5 text-red-600 cursor-pointer hover:w-6 hover:h-6 transition-all duration-300 ease-in-out" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
};

export default HospitalDoctors;
