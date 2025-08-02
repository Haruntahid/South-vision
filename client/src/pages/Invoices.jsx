import React, { useEffect, useState } from "react";
// Custom hook for public axios
import { FaSearch } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";

function Invoices() {
  const axiosPublic = useAxiosPublic();
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axiosPublic.get("/api/v1/invoices", {
        params: {
          page: currentPage,
          limit: 10,
          invoiceNumber,
          patientName,
        },
      });
      setInvoices(res.data.invoices);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, invoiceNumber, patientName]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchInvoices();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Invoices</h2>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Search by invoice number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Search by patient name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-black text-white hover:bg-gray-800 rounded px-4 flex items-center justify-center"
        >
          <FaSearch className="mr-2" /> Search
        </button>
      </form>

      {/* Invoice List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : invoices.length === 0 ? (
        <p className="text-center text-gray-500">No invoices found.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="border p-4 rounded shadow-sm bg-white hover:shadow-md transition"
            >
              <p className="font-semibold">
                Invoice #: {invoice.invoiceNumber}
              </p>
              <p>Patient: {invoice.Patient?.name}</p>
              <p>Phone: {invoice.Patient?.phone}</p>
              <p className="mt-2 font-medium">Tests:</p>
              <ul className="ml-4 list-disc">
                {invoice.TestResults.map((result) => (
                  <li key={result.id}>
                    {result.Test?.name} - ${result.Test?.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-1 text-lg font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-1 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Invoices;
