import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

const PendingAppointments = () => {
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
        `${import.meta.env.VITE_API_BACKEND}/doctor/fetchMyAppointments`,
        {
          withCredentials: true,
        }
      );
      setAppointments(response.data);
      console.log(response.data);
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
      if (
        past_or_future === "past" ||
        appointments[i].status === "Cancelled" ||
        appointments[i].status === "Not accepted"
      ) {
        setPastAppointments((prevPastAppointments) => [
          appointments[i],
          ...prevPastAppointments,
        ]);
      } else if (
        (past_or_future === "today" && appointments[i].status === "Pending") ||
        (past_or_future === "future" && appointments[i].status === "Pending")
      ) {
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

  const AcceptAppointment = async (id) => {
    const data = {
      status: "Confirmed",
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/user/updateAppointmentStatus/${id}`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success("Appointment Cancelled Successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error cancelling Appointment");
    }
  };

  const DeclineAppointment = async (id) => {
    const data = {
      status: "Not accepted",
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/user/updateAppointmentStatus/${id}`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success("Appointment Cancelled Successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error cancelling Appointment");
    }
  };
  return (
    <>
      <div className="p-4">
        {appointments.length > 0 ? (
          <>
            {futureAppointments.length > 0 ? (
              <>
                {/* Penduing requests */}
                <div className="flex flex-col justify-center items-center m-1 ">
                  <div className="bg-emerald-100 w-full text-center rounded-t-2xl">
                    <h1 className="font-bold p-4 ">PENDING REQUESTS</h1>
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
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {futureAppointments.map((appointment, index) => (
                          <tr key={appointment._id}>
                            <td>{formatDate(appointment.appointment)}</td>
                            <td>{formatTime(appointment.appointment)}</td>
                            <td>{appointment.patient_name}</td>

                            <td>{calculateAge(appointment.dob)}</td>
                            <td>{appointment.gender}</td>
                            <td className="flex">
                              <div className="flex justify-start items-center mx-1">
                                <div
                                  data-tip="Accept appointment"
                                  className="tooltip tooltip-left border-1 border-white text-green-600 bg-green-100 px-2 rounded-2xl cursor-pointer hover:bg-white hover:border-1 hover:border-green-600 transition-all duration-300 ease-in-out"
                                  onClick={(id) =>
                                    AcceptAppointment(appointment._id)
                                  }
                                >
                                  <TiTick className="text-lg" />
                                </div>
                              </div>
                              <div className="flex justify-start items-center mx-1">
                                <div
                                  data-tip="Decline appointment"
                                  className="tooltip tooltip-left border-1 border-white text-red-600 bg-red-100 px-2 rounded-2xl cursor-pointer hover:bg-white hover:border-1 hover:border-red-600 transition-all duration-300 ease-in-out"
                                  onClick={(id) =>
                                    DeclineAppointment(appointment._id)
                                  }
                                >
                                  <RxCross2 className="text-lg" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center text-xl text-gray-500 p-8">
                No Pending Requests!
              </div>
            )}

            {pastAppointments.length > 0 && (
              <>
                {/* Divider */}
                <div className="divider"></div>

                {/* Rest all Appointments */}
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
                          <th>Date</th>
                          <th>Time</th>
                          <th>Patient</th>
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
            )}
          </>
        ) : (
          <div className="flex justify-center items-center text-xl text-gray-500 p-8">
            No appointments found!
          </div>
        )}
      </div>
    </>
  );
};

export default PendingAppointments;
