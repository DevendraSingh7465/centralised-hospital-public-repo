import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const BookAppointmentForSelf = () => {
  // React Hooks for navigation and state management
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [doctorID, setDoctorID] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [userDetails, setUserDetails] = useState([]);

  // React Hook Form hooks
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  // Fetch doctor details from URL parameters
  function fetchDoctorDetails() {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("doctorID");
    const name = searchParams.get("doctorName");
    setDoctorID(id);
    setDoctorName(name);
  }

  // Fetch user details from jwt token api
  async function fetchUserDetails() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/user/fetchSingleUser`,
        { withCredentials: true }
      );
      setUserDetails(response.data);
      //   console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDoctorDetails();
    fetchUserDetails();
  }, []);

  const BooknewAppointment = async (data) => {
    console.log(userDetails);
    const patient = {
      patient_name: userDetails.name,
      mobile: userDetails.mobile,
      gender: userDetails.gender,
      dob: userDetails.dob,
      appointment: data.appointment,
      problem: data.problem,
      doctorId: doctorID,
      doctor_name: doctorName,
    };
    try {
      const response = await axios.post(
        `http://localhost:5000/user/book`,
        patient,
        {
          withCredentials: true,
        }
      );
      toast.success("Appointment booked successfully!");
      reset();
      navigate(`/view_appointment`);
    } catch (error) {
      toast.warn("Failed to book appointment. Please try again.");
      console.log(error.response.data);
    }
  };
  return (
    <>
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Book Appointment</h1>
        </div>
        <div className="rounded border-1 border-gray-300 p-3">
          <form onSubmit={handleSubmit((data) => BooknewAppointment(data))}>
            <div className="rounded border-1 border-gray-300 p-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* Appointment Date and Time*/}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Appointment Date and Time
                    </legend>
                    <input
                      type="datetime-local"
                      className="input"
                      min={new Date().toISOString().slice(0, 16)}
                      {...register("appointment", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Problem */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Problem</legend>
                    <label className="input">
                      <input
                        type="input"
                        placeholder="Describe your problem"
                        pattern="[A-Za-z\s]*"
                        {...register("problem")}
                      />
                    </label>
                    <p className="fieldset-label">Optional</p>
                  </fieldset>
                </div>
              </div>
            </div>
            <div>
              <button className="btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent hover:border-2 hover:border-emerald-600 my-4">
                Book Appointment
              </button>
              <Link
                to="/"
                className="m-1 btn bg-red-500 text-white hover:text-red-500 hover:bg-transparent hover:border-2 hover:border-red-500 my-4"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default BookAppointmentForSelf;
