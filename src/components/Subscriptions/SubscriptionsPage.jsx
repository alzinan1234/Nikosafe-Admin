// components/SubscriptionsPage.jsx (Refactored)
"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CreateSubscriptionModal from "./CreateSubscriptionModal";
import UpdateSubscriptionModal from "./UpdateSubscriptionModal"; // New import
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 3;

export default function SubscriptionsPage() {
  const [showCreateSubscriptionModal, setShowCreateSubscriptionModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://dreckks-backend.onrender.com/api/v1/subscription/all-subscription");
      setSubscriptions(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch all subscriptions:", err);
      setError("Failed to load subscriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleSubscription = async (id) => {
    setLoading(true); // Added loading state for the single fetch
    try {
      const response = await axios.get(`https://dreckks-backend.onrender.com/api/v1/subscription/${id}`);
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch single subscription:", err);
      setError("Failed to load subscription details. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = useMemo(() => {
    // ... (logic is the same)
    const normalize = (str) => (str || "").toLowerCase().replace(/[\s_]/g, "");
    if (selectedFilter === "All") {
      return subscriptions;
    }
    const normalizedFilter = normalize(selectedFilter);
    return subscriptions.filter((sub) => normalize(sub.category) === normalizedFilter);
  }, [subscriptions, selectedFilter]);

  const totalPages = Math.ceil(filteredSubscriptions.length / ITEMS_PER_PAGE);

  const paginatedSubscriptions = useMemo(() => {
    // ... (logic is the same)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSubscriptions.slice(startIndex, endIndex);
  }, [currentPage, filteredSubscriptions]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditClick = async (subscriptionId) => {
    const subscriptionData = await fetchSingleSubscription(subscriptionId);
    if (subscriptionData) {
      setEditingSubscription(subscriptionData);
    }
  };

  // New function to handle the update from the modal
  const handleSubscriptionUpdated = (updatedSubscription) => {
    // Optimistically update the list in the parent
    setSubscriptions(currentSubscriptions =>
      currentSubscriptions.map(sub =>
        sub._id === updatedSubscription._id ? updatedSubscription : sub
      )
    );
    // Close the modal and clear the editing state
    setEditingSubscription(null);
  };
  
  const handleAddSubscription = async (newSubscription) => {
    try {
      await axios.post("https://dreckks-backend.onrender.com/api/v1/subscription/create-subscription", newSubscription);
      fetchSubscriptions();
      setShowCreateSubscriptionModal(false);
    } catch (err) {
      console.error("Failed to add subscription:", err);
      alert("Failed to add subscription. Please try again.");
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      const originalSubscriptions = [...subscriptions];
      setSubscriptions(currentSubscriptions => currentSubscriptions.filter(sub => sub._id !== id));
      try {
        await axios.delete(`https://dreckks-backend.onrender.com/api/v1/subscription/${id}`);
      } catch (err) {
        console.error("Failed to delete subscription:", err);
        alert("Failed to delete subscription. Please try again.");
        setSubscriptions(originalSubscriptions);
      }
    }
  };

  const openCreateSubscriptionModal = () => {
    setEditingSubscription(null);
    setShowCreateSubscriptionModal(true);
  };

  const closeCreateSubscriptionModal = () => {
    setShowCreateSubscriptionModal(false);
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) end = maxPagesToShow - 1;
      else if (currentPage >= totalPages - 2) start = totalPages - (maxPagesToShow - 2);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);


  return (
    <div>
      <div className="bg-[#2E2E2E] min-h-screen text-white p-8 rounded">
        {/* ... (UI remains the same) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[20px] font-semibold">Subscriptions</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent border border-[#404040] text-white py-2 pl-4 pr-8 rounded-[18px] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                style={{
                  background:
                    "url(\"data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\") no-repeat right 8px center",
                  backgroundSize: "20px",
                }}
              >
                <option value="All" className="bg-[#2E2E2E]">All</option>
                <option value="Service Provider" className="bg-[#2E2E2E]">For Service Providers</option>
                <option value="User" className="bg-[#2E2E2E]">For Users</option>
                <option value="Hospitality Venue" className="bg-[#2E2E2E]">For Hospitality Venue</option>
              </select>
            </div>
            <button
              onClick={openCreateSubscriptionModal}
              className="flex items-center gap-2 pl-[2px] pr-[13px] py-1"
              style={{
                borderRadius: "22px",
                background: "rgba(255,255,255,0.10)",
              }}
            >
              <span className="w-[27px] h-[27px] flex items-center justify-center text-black rounded-full bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 27 27" fill="none">
                  <path d="M13.49 6.75L13.49 20.25" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20.24 13.5L6.73999 13.5" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-white font-medium text-[12px]">
                Create Subscriptions
              </span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-cyan-400" size={40} />
          </div>
        )}
        {error && <div className="text-center py-8 text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="md:flex gap-[26px] flex-wrap">
            {paginatedSubscriptions.length > 0 ? (
              paginatedSubscriptions.map((subscription) => (
                <div key={subscription._id} className="border border-[#E4E4E4] rounded-lg p-6 shadow-lg w-[338px] h-auto mb-6">
                  <h2 className="text-[24px] text-[#BBBBBB] font-semibold mb-2">{subscription.title}</h2>
                  <p className="text-[30px] font-semibold mb-4 bg-gradient-to-b from-[#FFFFFF] to-[#686868] text-transparent bg-clip-text">
                    {subscription.billingCycle}
                  </p>
                  <p className="text-5xl font-semibold mb-6 bg-gradient-to-b from-[#FFFFFF] to-[#686868] text-transparent bg-clip-text">
                    ${subscription.price}
                  </p>
                  <ul className="space-y-3 mb-6 text-[#595959]">
                    {subscription.features && subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-7 h-5 text-[#595959] mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditClick(subscription._id)} className="text-gray-400 hover:text-white border p-[10px] border-[#FFFFFF1A] rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteSubscription(subscription._id)} className="text-red-500 hover:text-red-400 border rounded-full border-[#FF000033] p-[10px]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 text-gray-400">
                No subscriptions found.
              </div>
            )}
          </div>
        )}

        {showCreateSubscriptionModal && (
          <CreateSubscriptionModal
            onClose={closeCreateSubscriptionModal}
            onSave={handleAddSubscription}
          />
        )}
        
        {/* NEW: Conditional rendering for the Update Modal */}
        {editingSubscription && (
          <UpdateSubscriptionModal
            onClose={() => setEditingSubscription(null)}
            initialData={editingSubscription}
            onSubscriptionUpdated={handleSubscriptionUpdated}
          />
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 gap-2 text-sm">
          {/* ... (Pagination UI remains the same) */}
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-[#2d2d2d] text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1" stroke="#E2E2E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
            ) : (
              <button key={page} onClick={() => handlePageChange(page)} className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === page ? "bg-[#21F6FF] text-black" : "hover:bg-[#2d2d2d] text-gray-400"}`}>
                {page}
              </button>
            )
          )}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-[#2d2d2d] text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}