import React, { useEffect, useState } from "react";
import axios from "axios";
const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(appointments);

  const handleSearchChange = (e) => {
    setSearchQuery(e);
  };

  useEffect(() => {
    let result = [...appointments];
    // Filter by Name
    if (searchQuery) {
      result = result.filter((appointment) =>
        appointment.patient_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPatients(result);
  }, [searchQuery, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/admin/getAllAppointments`,
        {
          withCredentials: true,
        }
      );
      setAppointments(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
      // toast.error("Error fetching Appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="text-emerald-500">Appointments</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">All Appointments</h1>
        </div>
        {appointments.length > 0 ? (
          <>
            <label className="input m-2">
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
                placeholder="Search Patient Name"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </label>
            {/* All Appointments */}
            <div className="flex flex-col justify-center items-center m-1 ">
              <div className="bg-emerald-100 w-full text-center rounded-t-2xl">
                <h1 className="font-bold p-4 ">ALL APPOINTMENTS</h1>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-box text-black w-full">
                <table className="table text-black border-b-2 border-green-200">
                  {/* head */}
                  <thead>
                    <tr className="text-black bg-green-50">
                      <th>Visit Date</th>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((appointment, index) => (
                      <tr key={appointment._id}>
                        <td>{formatDate(appointment.appointment)}</td>
                        <td>{formatTime(appointment.appointment)}</td>
                        <td>{appointment.patient_name}</td>
                        <td>{appointment.doctor_name}</td>
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
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center text-xl text-gray-500 p-8">
            No appointments found!
          </div>
        )}
      </section>
    </div>
  );
};

export default AllAppointments;
