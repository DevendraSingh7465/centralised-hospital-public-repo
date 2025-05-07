import React from "react";
import { Link } from "react-router-dom";
const PageNotFound = () => {
  return (
    <section className="">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <h1 className="mt-3 text-2xl font-semibold text-emerald-500  md:text-3xl">
            Page not found
          </h1>
          <p className="mt-4 text-gray-500 ">
            The page you are looking for doesn't exist.
          </p>

          <div className="flex justify-center items-center w-full mt-6 gap-x-3 shrink-0 ">
            <Link className="btn bg-emerald-500 text-white" to="/">
              Home Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
