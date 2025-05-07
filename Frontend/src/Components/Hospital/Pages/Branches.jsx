import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCaretDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidMessageDots } from "react-icons/bi";
import { RiEditBoxFill } from "react-icons/ri";

const Branches = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  const [branches, setBranches] = useState([]);
  const [branchDetails, setBranchDetails] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const fetchHospitalBranches = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/hospital/fetchHospitalBranches`,
        {
          withCredentials: true,
        }
      );
      const response2 = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/hospital/getDoctors`,
        {
          withCredentials: true,
        }
      );
      setBranches(response.data);
      setDoctors(response2.data);
      if (response.data.length % 10 == 0) {
        setPagesCount(response.data.length / 10);
      } else {
        const set_page_count = Math.floor(response.data.length / 10);
        setPagesCount(set_page_count + 1);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching Branches");
    }
  };

  useEffect(() => {
    fetchHospitalBranches();
  }, []);

  useEffect(() => {
    const branch_data = branches.map((branch) => {
      const doctorCount = doctors.filter(
        (doctor) => doctor.branch === branch.branch
      ).length;
      // console.log(hospital.name,":",doctorCount);
      

      return {
        _id: branch._id,
        branch: branch.branch,
        doctorCount: doctorCount,
      };
    });
    // console.log(hospitals_data);
    setBranchDetails(branch_data);
  }, [branches, doctors]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = branchDetails.slice(firstPostIndex, lastPostIndex);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const previosPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const deleteBranch = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BACKEND}/hospital/deleteBranch/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Branch deleted successfully");
      fetchHospitalBranches();
      // console.log(response.data);
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
          <li className="text-emerald-500">Branches</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        {/* Heading */}
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Branches</h1>
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
              <input type="search" className="grow" placeholder="Search" />
            </label>
          </div>

          {/* Add Branch */}
          <div className="flex justify-center items-center mx-2">
            <Link
              to="/hospital/admin/addBranch"
              className="btn bg-emerald-50 border-emerald-500 border-2 text-emerald-500 hover:bg-emerald-500 hover:text-white"
            >
              Add Branch
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
                <th>Doctors</th>
                {/* <th>City</th>
                <th>Email</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {currentPosts.map((branches, index) => (
                <tr key={branches._id}>
                  <th>{index + 1}</th>
                  <td>{branches.branch}</td>
                  <td>{branches.doctorCount}</td>
                  <td className="flex justify-start items-center ">
                    <div className="">
                      <Link
                        className="tooltip w-6 h-6"
                        data-tip="Delete"
                        onClick={(id) => deleteBranch(branches._id)}
                      >
                        <RiDeleteBin6Line className="w-5 h-5 text-red-600 cursor-pointer hover:w-6 hover:h-6 transition-all duration-300 ease-in-out" />
                      </Link>
                    </div>
                  </td>
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
    </div>
  );
};

export default Branches;
