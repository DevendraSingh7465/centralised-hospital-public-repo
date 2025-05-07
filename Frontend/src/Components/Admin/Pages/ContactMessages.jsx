import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ContactMessages = () => {
  const [contactMessages, setContactMessages] = useState([]);

  const [pagesCount, setPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(contactMessages);

  const handleSearchChange = (e) => {
    setSearchQuery(e);
  };

  useEffect(() => {
    let result = [...contactMessages];

    // Filter by Name and email
    if (searchQuery) {
      result = result.filter(
        (message) =>
          message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPatients(result);
  }, [searchQuery, contactMessages]);

  useEffect(() => {
    const fetchContactMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/admin/getMessages`,
          {
            withCredentials: true,
          }
        );
        setContactMessages(response.data);
        // console.log(response.data);
        if (response.data.length % 10 == 0) {
          setPagesCount(response.data.length / 10);
        } else {
          const set_page_count = Math.floor(response.data.length / 10);
          setPagesCount(set_page_count + 1);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching messages!");
      }
    };
    fetchContactMessages();
  }, []);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = contactMessages.slice(firstPostIndex, lastPostIndex);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const previosPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-2">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul className="">
          <li className="">Admin</li>
          <li className="text-emerald-500">Messages</li>
        </ul>
      </div>

      {/* Page */}
      <section className="text-black">
        {/* Heading */}
        <div className="flex justify-start items-center">
          <h1 className="text-2xl font-bold py-3">Messages</h1>
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
              <input
                type="search"
                className="grow"
                placeholder="Search Name or Email"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </label>
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
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {filteredPatients.map((message, index) => (
                <tr key={message._id}>
                  <th>{index + 1}</th>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.message}</td>
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

export default ContactMessages;
