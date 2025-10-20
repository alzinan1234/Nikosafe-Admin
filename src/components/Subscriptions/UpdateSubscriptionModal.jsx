// components/UpdateSubscriptionModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function UpdateSubscriptionModal({
  onClose,
  initialData,
  onSubscriptionUpdated,
}) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeaturesChange = (e) => {
    const featuresArray = e.target.value.split(',').map((f) => f.trim());
    setFormData({ ...formData, features: featuresArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.patch(
        `https://dreckks-backend.onrender.com/api/v1/subscription/${formData._id}`,
        formData,
      );
      onSubscriptionUpdated(formData);
      onClose();
    } catch (err) {
      console.error('Failed to update subscription:', err);
      setError('Failed to update subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
  <div className="bg-[#2E2E2E] rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative text-white border border-[#E4E4E4]">
        <div className='flex justify-between items-center mb-6'>
            <h2 className="text-2xl font-bold   text-white">Update Subscription</h2>
            <button
          onClick={onClose}
          className="   text-gray-300 hover:text-cyan-400 text-2xl font-bold"
          aria-label="Close"
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white font-semibold mb-1">Title</label>
            <input
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="Subscription Title"
              required
              className="w-full border border-[#929292] bg-[#232323] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Price</label>
            <input
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="Price"
              required
              className="w-full border border-[#929292] bg-[#232323] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Billing Cycle</label>
            <input
              name="billingCycle"
              value={formData.billingCycle || ''}
              onChange={handleChange}
              placeholder="Billing Cycle (e.g., Monthly, Yearly)"
              required
              className="w-full border border-[#929292] bg-[#232323] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Category</label>
            <input
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              placeholder="Category (e.g., User, Service Provider)"
              required
              className="w-full border border-[#929292] bg-[#232323] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Features (comma-separated)</label>
            <textarea
              name="features"
              value={formData.features ? formData.features.join(', ') : ''}
              onChange={handleFeaturesChange}
              placeholder="Features (comma-separated)"
              className="w-full border border-[#929292] bg-[#232323] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
              rows={3}
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="flex justify-end gap-2 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-cyan-400 font-semibold border border-[#929292]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-cyan-400 hover:bg-cyan-300  border-b-4 border-lime-400 text-white font-semibold  flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}