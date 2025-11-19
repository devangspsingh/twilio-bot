import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  MessageSquareText,
  User, 
  Box, 
  Clock, 
  RefreshCw, 
  AlertCircle,
  Smartphone,
  Zap,
  ShieldCheck,
  Star
} from 'lucide-react';

const App = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/reviews');
      
      if (!response.ok) {
        throw new Error('Failed to connect to backend');
      }
      
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("API Error:", err);
      setError("Could not fetch reviews. Ensure the backend is running.");
      
      // Fallback Mock Data
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
        },
        {
          id: 3,
          user_name: "Sarah",
          product_name: "MacBook Air M2",
          product_review: "The midnight color is stunning but attracts fingerprints. Performance is beastly.",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          contact_number: "+14155550102"
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

  const FeatureCard = ({ icon: Icon, title, desc, colorClass }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg ${colorClass} text-white`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquareText className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
              Customer Feedback
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Real-time customer feedback collected via Twilio Bot
            </p>
          </div>
          <button 
            onClick={fetchReviews}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm font-medium text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Feed
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard 
            icon={Smartphone} 
            title="WhatsApp Integration" 
            desc="Seamlessly collect reviews through conversational WhatsApp messages."
            colorClass="bg-green-500"
          />
          <FeatureCard 
            icon={Zap} 
            title="Real-time Sync" 
            desc="Reviews appear instantly on this dashboard as they are received."
            colorClass="bg-blue-500"
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Verified Sources" 
            desc="Authentic feedback linked directly to user contact numbers."
            colorClass="bg-indigo-500"
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Backend Connection Failed</p>
              <p className="text-sm mt-1 opacity-90">
                Showing <strong>demo data</strong>. Ensure FastAPI is running at <code>http://localhost:8000</code>.
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        {loading && !reviews.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-4" />
            <p>Loading reviews...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/2">Review</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-sm mr-3 shadow-sm">
                            {review.user_name ? review.user_name[0].toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{review.user_name}</div>
                            <div className="text-xs text-gray-400">{review.contact_number.slice(0,12)}xxxxxxx</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                          <Box className="w-4 h-4 mr-2 text-gray-400" />
                          {review.product_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                          {review.product_review}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1.5 text-gray-400" />
                          {formatDate(review.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {reviews.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-medium">No reviews yet</h3>
                <p className="text-gray-500 text-sm mt-1">Send a message to the WhatsApp bot to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;