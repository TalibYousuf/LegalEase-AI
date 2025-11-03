import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Payment() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
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
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to create Razorpay order
  const createRazorpayOrder = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:4001/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          plan: selectedPlan,
          amount: selectedPlan === 'monthly' ? 2999 : 29999 // Amount in smallest currency unit (paise)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Could not create payment order. Please try again.');
      return null;
    }
  };

  // Function to open Razorpay payment form
  const openRazorpayCheckout = (orderData) => {
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay key ID
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'LegalEase AI',
      description: `${selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Subscription`,
      order_id: orderData.id,
      handler: function (response) {
        // Handle successful payment
        verifyPayment(response);
      },
      prefill: {
        name: formData.cardName || '',
        email: localStorage.getItem('userEmail') || '',
      },
      theme: {
        color: '#7C3AED' // Purple color matching the UI
      }
    };
    
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  // Function to verify payment with backend
  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch('http://localhost:4001/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Payment successful! Your subscription is now active.');
        navigate('/dashboard');
      } else {
        alert('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (paymentMethod === 'razorpay') {
      const orderData = await createRazorpayOrder();
      setLoading(false);
      
      if (orderData) {
        openRazorpayCheckout(orderData);
      }
    } else {
      // Legacy payment processing (simulation)
      setTimeout(() => {
        setLoading(false);
        alert('Payment successful! Your subscription is now active.');
        navigate('/dashboard');
      }, 1500);
    }
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
                      paymentMethod === 'razorpay' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    Razorpay
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
                    {loading ? 'Processing...' : `Pay ${selectedPlan === 'monthly' ? plans.monthly.price : plans.yearly.price}`}
                  </button>
                </form>
              ) : (
                <div>
                  <p className="text-gray-300 mb-6">
                    You'll be redirected to Razorpay's secure payment gateway to complete your purchase.
                  </p>
                  
                  <button
                    onClick={handleSubmit}
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Pay with Razorpay - ${selectedPlan === 'monthly' ? plans.monthly.price : plans.yearly.price}`}
                  </button>
                </div>
              )}
              
              <div className="mt-6 text-center text-sm text-gray-400">
                Your payment is secured with industry-standard encryption
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Payment;