import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Payment() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Show success message and redirect
      alert('Payment successful! Your subscription is now active.');
      navigate('/dashboard');
    }, 1500);
  };

  const plans = {
    monthly: {
      price: '$29.99',
      features: [
        'Up to 50 document uploads per month',
        'AI-powered document analysis',
        'Clause comparison',
        'Document summary generation',
        'Email support'
      ]
    },
    yearly: {
      price: '$299.99',
      features: [
        'Up to 100 document uploads per month',
        'AI-powered document analysis',
        'Clause comparison',
        'Document summary generation',
        'Priority email support',
        'API access',
        '2 months free'
      ]
    }
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Redirecting to login...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">Subscription Plans</h1>
          
          <div className="max-w-4xl mx-auto">
            {/* Plan Selection */}
            <div className="flex flex-col md:flex-row gap-6 mb-10">
              <div 
                className={`flex-1 bg-gray-800 p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPlan === 'monthly' ? 'border-purple-500' : 'border-gray-700'
                }`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Monthly Plan</h3>
                  <div className="text-2xl font-bold text-purple-400">{plans.monthly.price}</div>
                </div>
                <p className="text-gray-400 mb-4">Perfect for short-term projects</p>
                <ul className="space-y-2">
                  {plans.monthly.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div 
                className={`flex-1 bg-gray-800 p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPlan === 'yearly' ? 'border-purple-500' : 'border-gray-700'
                }`}
                onClick={() => setSelectedPlan('yearly')}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Annual Plan</h3>
                  <div className="text-2xl font-bold text-purple-400">{plans.yearly.price}</div>
                </div>
                <p className="text-gray-400 mb-4">Best value for long-term usage</p>
                <ul className="space-y-2">
                  {plans.yearly.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 bg-purple-900 bg-opacity-30 text-purple-300 p-2 rounded text-center">
                  Save 17% compared to monthly
                </div>
              </div>
            </div>
            
            {/* Payment Form */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
              
              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  <button
                    className={`flex-1 py-2 px-4 rounded-md ${
                      paymentMethod === 'card' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    Credit Card
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded-md ${
                      paymentMethod === 'paypal' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    PayPal
                  </button>
                </div>
              </div>
              
              {paymentMethod === 'card' ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-2">CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Subscribe Now - ${selectedPlan === 'monthly' ? plans.monthly.price : plans.yearly.price}`}
                  </button>
                  
                  <p className="text-sm text-gray-400 mt-4 text-center">
                    Your payment information is securely processed. We don't store your card details.
                  </p>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-6">You'll be redirected to PayPal to complete your payment.</p>
                  <button
                    onClick={handleSubmit}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Continue to PayPal'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Payment;