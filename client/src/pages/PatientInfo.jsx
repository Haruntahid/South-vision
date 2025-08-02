import React, { useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";

function PatientInfo() {
  const axiosPublic = useAxiosPublic();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = async () => {
    try {
      const response = await axiosPublic.get("/api/v1/patient", {
        params: {
          page,
          limit,
          search,
        },
      });
      setPatients(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Patient Information
      </h2>

      <input
        type="text"
        placeholder="Search by name or phone"
        value={search}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {patients.length === 0 ? (
        <p className="text-center text-gray-500">No patients found.</p>
      ) : (
        <div className="bg-white rounded-md shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id} className="border-t">
                  <td className="px-4 py-2">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-2">{patient.name}</td>
                  <td className="px-4 py-2">{patient.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700 font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PatientInfo;
