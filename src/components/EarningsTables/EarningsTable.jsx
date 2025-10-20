// components/EarningsTable.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TransactionDetailsModal from "./TransactionDetailsModal"; // Import the new modal component

// Dummy data for weekly and monthly
const dummyWeeklyData = Array.from({ length: 90 }).map((_, i) => ({
  serial: `INV093${i}`,
  userName: "Nothing Studio", // Changed from 'user' to 'userName'
  userType: "Service provider", // New field for User Type
  subscriptionType: "Annual Fee", // Changed from 'subscription' to 'subscriptionType'
  amount: 50, // Stored as a number
  accNumber: `4548465446`, // Consistent Account Number
  date: `Aug. 15, 2023 02:29 PM`, // Consistent Date format
  fullName: "Jane Cooper",
  email: "abc@example.com",
  phone: "(319) 555-0115",
  transactionID: `TXN${100000 + i}`,
  accHolderName: "Wade Warren",
  receivedAmount: 50, // Matches amount, assuming no additional calculations needed here for the modal.
  detectPercentage: 10, // Example value
  finalAmount: 45, // Example value (amount - percentage)
  userImagePath: "/image/user-photo.png", // Assuming this path is correct
}));

const dummyMonthlyData = Array.from({ length: 75 }).map((_, i) => ({
  serial: `INV094${i}`,
  userName: "Design Co.",
  userType: "Agency", // Example User Type for monthly
  subscriptionType: "Monthly Subscription", // Example Subscription Type for monthly
  amount: 150, // Stored as a number
  accNumber: `987654321${i % 10}`,
  date: `Sep. 01, 2023 10:00 AM`,
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "(123) 456-7890",
  transactionID: `TXN${200000 + i}`,
  accHolderName: "Alice Smith",
  receivedAmount: 150,
  detectPercentage: 15,
  finalAmount: 127.5,
  userImagePath: "/image/user-photo.png", // Assuming this path is correct
}));


const itemsPerPage = 10;

export default function EarningsTable() {
  const [selected, setSelected] = useState("Weekly");
  const [open, setOpen] = useState(false);
  const options = ["Weekly", "Monthly"];
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(dummyWeeklyData); // State to hold current data (weekly/monthly)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    if (selected === "Weekly") {
      setData(dummyWeeklyData);
    } else {
      setData(dummyMonthlyData);
    }
    setCurrentPage(1); // Reset to first page when data changes
  }, [selected]);


  const filteredData = data.filter((item) =>
    item.userName.toLowerCase().includes(search.toLowerCase()) ||
    item.userType.toLowerCase().includes(search.toLowerCase()) || // Include userType in search
    item.serial.toLowerCase().includes(search.toLowerCase()) ||
    item.subscriptionType.toLowerCase().includes(search.toLowerCase()) || // Use subscriptionType
    item.accNumber.toLowerCase().includes(search.toLowerCase()) || // Include accNumber in search
    item.date.toLowerCase().includes(search.toLowerCase()) // Include date in search
  );


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeTransactionDetails = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <>
      <div className="bg-[#343434] text-white p-6 rounded-lg shadow-lg ">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Earnings Overview</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* search icon */}
            <div className="flex items-center ">
              <div className="relative">
                <MagnifyingGlassIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <path
                    d="M11 8.5L20 8.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 16.5L14 16.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="7"
                    cy="8.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 7 8.5)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="17"
                    cy="16.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 17 16.5)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Weekly/Monthly Revenue and Dropdown */}
        <div className="relative text-white flex flex-col justify-center items-center mb-6">
          <div className="mb-2 text-sm">
            {selected} Revenue <span className="font-bold">${selected === "Weekly" ? "12,322" : "35,000"}</span> {/* Dynamic revenue */}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-[8.31px] w-[73px] mb-5 h-[27px] pl-[6.65px] rounded-[18.28px] bg-white/10"
          >
            <span className="text-xs">{selected}</span>
            <ChevronDown size={16} className={`transform transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>

          <div
            className={`absolute top-full mt-1 w-[100px] rounded bg-white/20 backdrop-blur text-xs shadow-md z-10 transform transition-all duration-300 origin-top ${
              open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
            }`}
          >
            {options.map((option) => (
              <div
                key={option}
                className="px-3 py-1 cursor-pointer hover:bg-white/30"
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#17787C] text-white text-center">
                <th className="py-2 px-4">Serial</th>
                <th className="py-2 px-4">Name</th> {/* Changed from User to Name */}
                <th className="py-2 px-4">User Type</th> {/* New header */}
                <th className="py-2 px-4">Subscription Type</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Acc Number</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-gray-800 transition text-center"
                >
                  <td className="py-2 px-4">{item.serial}</td>
                  <td className="py-2 px-4 flex items-center gap-2 justify-center">
                    <Image
                      src={item.userImagePath} // Use the image path from dummy data
                      alt="User"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {item.userName} {/* Use userName */}
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-[#4CB2E2]">{item.userType}</span> {/* Display userType with color */}
                  </td>
                  <td className="py-2 px-4">{item.subscriptionType}</td>
                  <td className="py-2 px-4">${item.amount}</td> {/* Prepend $ */}
                  <td className="py-2 px-4">{item.accNumber}</td>
                  <td className="py-2 px-4">{item.date}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => openTransactionDetails(item)}>
                      <Image
                        src="/icon/eye.svg" // Ensure you have this image in public/icon
                        alt="action"
                        width={24}
                        height={24}
                        className="inline"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm text-white">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center border rounded-full justify-center p-[10px] hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
  <path d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1" stroke="#E2E2E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
        </button>
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          // Render a limited set of page numbers around the current page, plus first/last
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === pageNumber
                    ? "bg-[#21F6FF] text-white"
                    : "hover:bg-[#1f1f1f]"
                }`}
              >
                {pageNumber}
              </button>
            );
          } else if (
            (pageNumber === currentPage - 3 && currentPage > 4) ||
            (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
          ) {
            return (
              <span key={pageNumber} className="px-2">
                .....
              </span>
            );
          }
          return null;
        })}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center border rounded-full justify-center hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
  <path d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
        </button>
      </div>

      {/* Transaction Details Modal */}
      {/* <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={closeTransactionDetails}
        transaction={selectedTransaction}
      /> */}
    </>
  );
}