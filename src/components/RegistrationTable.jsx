// components/RegistrationTable.js
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { registrationService } from "@/lib/registrationService";

export default function ManageRegistration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch registrations on component mount
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Fetch registrations from API
  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await registrationService.getAllRegistrations();
      
      if (result.success) {
        // Limit to first 4 registrations
        const limitedData = result.data.slice(0, 4);
        setRegistrations(limitedData);
        setFilteredRows(limitedData);
      } else {
        setError(result.error || "Failed to fetch registrations");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const newFilteredRows = registrations.filter(
      (row) =>
        (row.business_name && row.business_name.toLowerCase().includes(term)) ||
        (row.type && row.type.toLowerCase().includes(term)) ||
        (row.subscription_type && row.subscription_type.toLowerCase().includes(term)) ||
        (row.email && row.email.toLowerCase().includes(term)) ||
        (row.created_at && row.created_at.toLowerCase().includes(term))
    );
    setFilteredRows(newFilteredRows);
  };

  const handleFilterClick = () => {
    alert("Filter button clicked! (Implement your filter modal/logic here)");
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#343434] p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[20px] font-semibold text-white">
          Manage Registrations
        </h2>

        {/* Search Input Field and Filter Button */}
      
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-white bg-[#00C1C980] border-b border-gray-700">
              <th className="py-2 font-[700] text-[14px] text-center">Name</th>
              <th className="text-center">Type</th>
              <th className="text-center">Subscription Type</th>
              <th className="text-center">Email</th>
              <th className="text-center">Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  Loading registrations...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-red-400">
                  {error}
                </td>
              </tr>
            ) : filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-gray-700 text-white">
                  <td className="py-2 text-center">
                    {row.business_name || "N/A"}
                  </td>
                  <td className="text-center">
                    <span
                      className={
                        row.type === "vendor" ? "text-[#FF4D00]" : "text-[#4976F4]"
                      }
                    >
                      {row.type === "vendor" ? "Vendor" : "Service Provider"}
                    </span>
                  </td>
                  <td className="text-center">
                    {row.subscription_type || "N/A"}
                  </td>
                  <td className="text-center">{row.email || "N/A"}</td>
                  <td className="text-center">{formatDate(row.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No matching registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}