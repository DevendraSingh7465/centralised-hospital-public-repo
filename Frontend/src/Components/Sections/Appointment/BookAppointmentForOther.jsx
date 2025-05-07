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

const BookAppointmentForOther = () => {
  // React Hooks for navigation and state management
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [doctorID, setDoctorID] = useState("");
  const [doctorName, setDoctorName] = useState("");

  // fetching Doctors detaisl from the params
  useEffect(() => {
    function fetchDoctorDetails() {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get("doctorID");
      const name = searchParams.get("doctorName");
      setDoctorID(id);
      setDoctorName(name);
    }
    fetchDoctorDetails();
  }, []);

  // React Hook Form hooks
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ shouldUnregister: true });

  const BooknewAppointment = async (data) => {
    const patient = {
      patient_name: data.patient_name,
      mobile: data.mobile,
      gender: data.gender,
      dob: data.dob,
      appointment: data.appointment,
      problem: data.problem,
      doctorId: doctorID,
      doctor_name: doctorName,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}/user/book`,
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
      console.log(error);
    }
  };
  return (
    <>
      <section className="text-black">
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Book Appointment</h1>
        </div>
        <div className="rounded border-1 border-gray-300 p-3">
          <div className="">
            <h1 className="font-bold text-2xl m-1">Patient Details</h1>
          </div>

          <form onSubmit={handleSubmit((data) => BooknewAppointment(data))}>
            <div className="rounded border-1 border-gray-300 p-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* Hospital Name */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Patient Name</legend>
                    <label className="input validator">
                      <input
                        type="input"
                        required
                        placeholder="Username"
                        pattern="[A-Za-z\s]*"
                        minLength="3"
                        maxLength="100"
                        {...register("patient_name", { required: true })}
                      />
                    </label>
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Mobile Number */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Contact</legend>
                    <input
                      type="tel"
                      className="input validator"
                      placeholder="967xxxx320"
                      pattern="^[0-9]+$"
                      minLength={10}
                      maxLength={10}
                      title="Field must contain only numbers"
                      {...register("mobile", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Gender */}
                <div className="flex">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Gender</legend>
                    <div className="flex items-center">
                      <div className="p-2">
                        <span className="mr-1">Male</span>
                        <input
                          type="radio"
                          name="gender"
                          className="radio radio-primary"
                          value="male"
                          {...register("gender", { required: true })}
                        />
                      </div>
                      <div className="p-2">
                        <span className="mr-1">Female</span>
                        <input
                          type="radio"
                          name="gender"
                          className="radio radio-secondary"
                          value="female"
                          {...register("gender", { required: true })}
                        />
                      </div>
                    </div>
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

                {/* Date of Birth */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Date of Birth</legend>
                    <input
                      type="date"
                      className="input validator"
                      max={new Date().toISOString().split('T')[0]}
                      {...register("dob", { required: true })}
                    />
                    <p className="fieldset-label">Required</p>
                  </fieldset>
                </div>

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

export default BookAppointmentForOther;
