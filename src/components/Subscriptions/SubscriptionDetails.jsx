
import React, { useEffect, useState } from "react";
import { getSubscriptionById } from "../lib/getSubscriptionById";



export default function SubscriptionDetails({ id, onClose }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const data = await getSubscriptionById(id);
        setSubscription(data.subscription || data); // adapt to your API response
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!subscription) return <div>No subscription found.</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">{subscription.title}</h2>
      <p><strong>Billing Cycle:</strong> {subscription.billingCycle || subscription.frequency}</p>
      <p><strong>Category:</strong> {subscription.category || subscription.targetAudience}</p>
      <p><strong>Price:</strong> {subscription.price}</p>
      <p><strong>Features:</strong></p>
      <ul className="list-disc ml-5">
        {(subscription.features || []).map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
      <button onClick={onClose} className="mt-4 px-4 py-2 bg-cyan-400 text-white rounded">Close</button>
    </div>
  );
}