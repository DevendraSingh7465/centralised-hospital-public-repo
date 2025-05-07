import React from "react";
import "./Styles/LandingPage.css";
const LandingPage = () => {
  return (
    <section>
      <div className="hero min-h-screen text-black ">
        <div
          className="hero-content flex-col lg:flex-row-reverse  rounded-2xl shadow bg-gradient-to-r from-emerald-100 via-emerald-100 to-transparent via-transparent"
        >
          <img src="./Doctor.png" className="max-w-sm rounded-lg h-140" />
          <div className="pl-7">
            <h1 className="text-5xl font-bold text-emerald-600">
              ONE STOP SOLUTION FOR YOUR MEDICAL NEEDS!
            </h1>
            <p className="py-6 text-emerald-600">
              You can see all your medical needs in one place. Book
              appointments, view appointments, and manage your health records.
            </p>
            <button className="btn bg-emerald-600 text-white hover:text-emerald-600 hover:bg-transparent hover:border-2 hover:border-emerald-600">
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
