import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidMessageDots } from "react-icons/bi";
import { RiEditBoxFill } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router-dom";

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitalDetails, setHospitalDetails] = useState([]);

  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  useEffect(() => {
    const FetchHospitals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/admin/GetHospitals`
        );
        const response2 = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/admin/GetDoctors`
        );
        const response3 = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/auth/getAllUsers`
        );
        // const response4 = await axios.get(
        //   `${import.meta.env.VITE_API_BACKEND}/admin/getAllAppointments`
        // );
        const response6 = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/admin/getAllBranchesWithID`
        );
        // console.log(response.data);
        setHospitals(response.data);
        setDoctors(response2.data);
        setUsers(response3.data);
        // setPatients(response4.data);
        setBranches(response6.data);
        if (response.data.length % 10 == 0) {
          setPagesCount(response.data.length / 10);
        } else {
          const set_page_count = Math.floor(response.data.length / 10);
          setPagesCount(set_page_count + 1);
        }
      } catch (error) {
        console.error(error);
      }
    };
    FetchHospitals();
  }, []);

  useEffect(() => {
    const hospitals_data = hospitals.map((hospital) => {
      const doctorCount = doctors.filter(
        (doctor) => doctor.hospitalId === hospital._id
      ).length;
      // console.log(hospital.name,":",doctorCount);
      const branchCount = branches.filter(
        (branch) => branch.hospitalId === hospital._id
      ).length;
      console.log(hospital.name,":",branchCount);


      return {
        _id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        city: hospital.city,
        doctorCount: doctorCount,
        branchCount: branchCount,
      };
    });
    // console.log(hospitals_data);
    setHospitalDetails(hospitals_data);
  }, [hospitals,doctors,branches]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = hospitalDetails.slice(firstPostIndex, lastPostIndex);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const previosPage = () => {
    setCurrentPage(currentPage - 1);
  };
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
          <div className="stat-title">Hospitals</div>
          <div className="stat-value">{hospitals.length}</div>
          <div className="stat-desc">Total</div>
        </div>

        <div className="stat">
          <div className="stat-title">Doctors</div>
          <div className="stat-value">{doctors.length}</div>
          <div className="stat-desc">From all hospitals</div>
        </div>

        <div className="stat">
          <div className="stat-title">Users</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-desc">Registrations</div>
        </div>
      </div>

      {/* Page */}
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Hospitals</h1>
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
                <th>Doctors</th>
                <th>Branches</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {currentPosts.map((hospital, index) => (
                <tr key={hospital._id}>
                  <th>{index + 1}</th>
                  <td>{hospital.name}</td>
                  <td>{hospital.email}</td>
                  <td>{hospital.doctorCount}</td>
                  <td>{hospital.branchCount}</td>
                  <td>{hospital.city}</td>
                  <td className="flex justify-start items-center ">
                    <div className="">
                      <Link className="tooltip w-6 h-6" data-tip="Details">
                        <BiSolidMessageDots className=" w-5 h-5 text-indigo-500 cursor-pointer hover:w-6 hover:h-6 transition-all duration-300 ease-in-out" />
                      </Link>
                      <Link
                        className="tooltip w-6 h-6"
                        data-tip="Edit"
                        to={`/admin/editHospital?hospitalId=${hospital._id}&hospitalName=${hospital.name}`}
                      >
                        <RiEditBoxFill className="w-5 h-5 text-emerald-500 cursor-pointer hover:w-6 hover:h-6 transition-all duration-300 ease-in-out" />
                      </Link>
                      <Link className="tooltip w-6 h-6" data-tip="Delete">
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

export default Dashboard;
