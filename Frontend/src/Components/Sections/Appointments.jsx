import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

const Appointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [futureAppointments, setFutureAppointments] = useState([]);

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

  function isDateFutureorPast(dateString) {
    const dateTime = new Date(dateString);

    if (isNaN(dateTime.getTime())) {
      return "invalid";
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate()
    );

    if (inputDate > today) {
      return "future";
    } else if (inputDate < today) {
      return "past";
    } else {
      return "today";
    }
  }

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/user/appointments`,
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

  const AppointmentSepearation = (appointments) => {
    for (let i = 0; i < appointments.length; i++) {
      const past_or_future = isDateFutureorPast(appointments[i].appointment);
      if (past_or_future === "past" || appointments[i].status === "Cancelled") {
        setPastAppointments((prevPastAppointments) => [
          appointments[i],
          ...prevPastAppointments,
        ]);
      } else if (past_or_future === "future" || past_or_future === "today") {
        setFutureAppointments((prevFutureAppointments) => [
          appointments[i],
          ...prevFutureAppointments,
        ]);
      } else {
        console.log("Invalid date");
      }
    }
  };

  useEffect(() => {
    AppointmentSepearation(appointments);
  }, [appointments]);

  const cancelAppointment = async (id) => {
    const data = {
      status: "Cancelled",
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/user/updateAppointmentStatus/${id}`,
        data,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data);
      toast.success("Appointment Cancelled Successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error cancelling Appointment");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4">
        {/* Breadcrumbs */}
        <div className="breadcrumbs text-sm ">
          <ul className="">
            <li className="">Patient</li>
            <li className="text-emerald-500">View Appointments</li>
          </ul>
        </div>
        {appointments.length > 0 ? (
          <>
            {futureAppointments.length > 0 && (
              <>
                {/* Upcoming Appointments */}
                <div className="flex flex-col justify-center items-center m-1 ">
                  <div className="bg-emerald-100 w-full text-center rounded-t-2xl">
                    <h1 className="font-bold p-4 ">UPCOMING APPOINTMENTS</h1>
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
                          <th>Branch</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Booking Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {futureAppointments.map((appointment, index) => (
                          <tr key={appointment._id}>
                            <td>{formatDate(appointment.appointment)}</td>
                            <td>{formatTime(appointment.appointment)}</td>
                            <td>{appointment.patient_name}</td>
                            <td>{appointment.doctor_name}</td>
                            <td>{appointment.branch}</td>
                            <td>{calculateAge(appointment.dob)}</td>
                            <td>{appointment.gender}</td>

                            {appointment.status === "Pending" && (
                              <>
                                <td>
                                  <div className="flex justify-start items-center">
                                    <div className="text-indigo-500 bg-indigo-100 px-2 rounded-2xl ">
                                      {appointment.status}
                                    </div>
                                  </div>
                                </td>

                                <td>
                                  <div className="flex justify-start items-center">
                                    <div
                                      className="text-red-600 bg-red-300 px-2 rounded-2xl cursor-pointer"
                                      onClick={(id) =>
                                        cancelAppointment(appointment._id)
                                      }
                                    >
                                      Cancel
                                    </div>
                                  </div>
                                </td>
                              </>
                            )}
                            {appointment.status === "Cancelled" && (
                              <td>
                                <div className="flex justify-start items-center">
                                  <div className="text-red-600 bg-red-300 px-2 rounded-2xl ">
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
                            {appointment.status === "Confirmed" && (
                              <td>
                                <div className="flex justify-start items-center">
                                  <div className="text-green-600 bg-green-100 px-2 rounded-2xl ">
                                    {appointment.status}
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
            )}

            {pastAppointments.length > 0 && (
              <>
                {/* Divider */}
                <div className="divider"></div>

                {/* Past Appointments */}
                <div className="flex flex-col justify-center items-center m-1 ">
                  <div className="bg-emerald-100 w-full text-center rounded-t-2xl">
                    <h1 className="font-bold p-4 ">PAST APPOINTMENTS</h1>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-box text-black w-full">
                    <table className="table text-black border-b-2 border-green-200">
                      {/* head */}
                      <thead>
                        <tr className="text-black bg-green-50">
                          <th>Date</th>
                          <th>Time</th>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Branch</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Booking Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastAppointments.map((appointment, index) => (
                          <tr key={appointment._id}>
                            <td>{formatDate(appointment.appointment)}</td>
                            <td>{formatTime(appointment.appointment)}</td>
                            <td>{appointment.patient_name}</td>
                            <td>{appointment.doctor_name}</td>
                            <td>{appointment.branch}</td>
                            <td>{calculateAge(appointment.dob)}</td>
                            <td>{appointment.gender}</td>

                            {appointment.status == "Cancelled" && (
                              <td>
                                <div className=" flex justify-start items-center">
                                  <div
                                    data-tip="You cancelled your appointment"
                                    className="tooltip tooltip-left text-red-600 bg-red-300 px-2 rounded-2xl"
                                  >
                                    Cancelled
                                  </div>
                                </div>
                              </td>
                            )}
                            {appointment.status == "Confirmed" && (
                              <td>
                                <div className="flex justify-start items-center">
                                  <div
                                    data-tip="Appointment was confirmed by the doctor"
                                    className="tooltip tooltip-left text-green-600 bg-green-100 px-2 rounded-2xl "
                                  >
                                    {appointment.status}
                                  </div>
                                </div>
                              </td>
                            )}
                            {appointment.status === "Not accepted" && (
                              <td>
                                <div className="flex justify-start items-center">
                                  <div
                                    data-tip="Appointment was not accepted by the doctor"
                                    className="tooltip tooltip-left text-yellow-600 bg-yellow-100 px-2 rounded-2xl "
                                  >
                                    {appointment.status}
                                  </div>
                                </div>
                              </td>
                            )}
                            {appointment.status === "Pending" && (
                              <td>
                                <div className="flex justify-start items-center">
                                  <div
                                    data-tip="Appointment was not accepted by the doctor"
                                    className="tooltip tooltip-left text-yellow-600 bg-yellow-100 px-2 rounded-2xl "
                                  >
                                    Not accepted
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
            )}
          </>
        ) : (
          <div className="flex justify-center items-center text-xl text-gray-500 p-8">
            No appointments found!
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Appointments;
