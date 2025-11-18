import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Box, Clock, RefreshCw, AlertCircle } from 'lucide-react';

const App = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real scenario, this points to your FastAPI backend
      // e.g., http://localhost:8000/api/reviews
      const response = await fetch('http://localhost:8000/api/reviews');
      
      if (!response.ok) {
        throw new Error('Failed to connect to backend');
      }
      
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("API Error:", err);
      setError("Could not fetch reviews. Ensure the backend is running.");
      
      // Fallback Mock Data for Preview Purposes so the UI is visible
      setReviews([
        {
          id: 1,
          user_name: "Aditi",
          product_name: "iPhone 15",
          product_review: "Amazing battery life, very satisfied with the camera quality too!",
          created_at: new Date().toISOString(),
          contact_number: "+14155550100"
        },
        {
          id: 2,
          user_name: "Rahul",
          product_name: "Sony WH-1000XM5",
          product_review: "Noise cancellation is top notch, but the earcups get warm.",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          contact_number: "+14155550101"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-8 h-8 text-green-500" />
              WhatsApp Reviews
            </h1>
            <p className="text-gray-500 mt-1">Live feed from Twilio Sandbox</p>
          </div>
          <button 
            onClick={fetchReviews}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error Banner (if API fails, we show mock data but warn user) */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Backend Connection Failed</p>
              <p className="text-sm mt-1">
                Showing <strong>demo data</strong> for visualization. Ensure your FastAPI server is running at <code>http://localhost:8000</code> and Postgres is connected.
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {loading && !reviews.length ? (
          <div className="text-center py-20 text-gray-400">Loading reviews...</div>
        ) : (
          <div className="grid gap-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Review</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm mr-3">
                            {review.user_name ? review.user_name[0].toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{review.user_name}</div>
                            <div className="text-xs text-gray-400">{review.contact_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Box className="w-4 h-4 mr-2 text-gray-400" />
                          {review.product_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{review.product_review}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(review.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {reviews.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No reviews received yet. Send a message to the WhatsApp bot!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;