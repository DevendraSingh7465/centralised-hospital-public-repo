import React, { useEffect, useState } from "react";
import axios from "axios";

const TodaysAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
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
        past_or_future === "today" &&
        appointments[i].status === "Confirmed"
      ) {
        setTodaysAppointments((prevTodaysAppointments) => [
          appointments[i],
          ...prevTodaysAppointments,
        ]);
      } else if (
        past_or_future === "future" &&
        appointments[i].status === "Confirmed"
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
  return (
    <>
      <div className="p-4">
        {appointments.length > 0 ? (
          <>
            {todaysAppointments.length > 0 ? (
              <>
                {/* Todays Appointments */}
                <div className="flex flex-col justify-center items-center m-1 ">
                  <div className="bg-emerald-100 w-full text-center rounded-t-2xl">
                    <h1 className="font-bold p-4 ">TODAY'S APPOINTMENTS</h1>
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
                          <th>Problem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todaysAppointments.map((appointment, index) => (
                          <tr key={appointment._id}>
                            <td>{formatDate(appointment.appointment)}</td>
                            <td>{formatTime(appointment.appointment)}</td>
                            <td>{appointment.patient_name}</td>
                            <td>{calculateAge(appointment.dob)}</td>
                            <td>{appointment.gender}</td>
                            <td>{appointment.problem}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center text-xl text-gray-500 p-8">
                No appointments found for today!
              </div>
            )}

            {futureAppointments.length > 0 && (
              <>
                {/* Divider */}
                <div className="divider"></div>

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
                          <th>Date</th>
                          <th>Time</th>
                          <th>Patient</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Problem</th>
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
                            <td>{appointment.problem}</td>
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

export default TodaysAppointments;
