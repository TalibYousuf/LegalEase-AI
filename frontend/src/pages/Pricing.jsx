import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Pricing() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    const onStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'per month',
      features: [
        'Up to 3 document uploads per day',
        'Basic summaries',
        'Access to dashboard',
      ],
      buttonText: isAuthenticated ? 'Go to Dashboard' : 'Start Free',
      buttonLink: isAuthenticated ? '/dashboard' : '/signup',
      highlighted: true
    },
    {
      name: 'Professional',
      price: '$79',
      period: 'per month',
      features: [
        'Up to 200 document analyses',
        'Advanced document summaries',
        'Document comparison',
        'Priority email support',
        'Up to 5 user accounts'
      ],
      buttonText: 'Get Started',
      buttonLink: '/signup',
      highlighted: false
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: 'per month',
      features: [
        'Unlimited document analyses',
        'Advanced document summaries',
        'Document comparison',
        'Custom AI training',
        '24/7 phone & email support',
        'Unlimited user accounts'
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/contact',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core document analysis features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-lg p-8 ${plan.highlighted 
                ? 'bg-indigo-900 border-2 border-indigo-500 transform -translate-y-2' 
                : 'bg-gray-800 border border-gray-700'}`}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
                
                <ul className="text-left space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to={plan.buttonLink}
                  className={`block w-full py-3 px-6 rounded-md text-center font-medium ${
                    plan.highlighted 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
          <p className="text-gray-300 mb-6">
            Contact our sales team to build a custom plan tailored to your organization's needs.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 py-3 px-8 rounded-md font-medium"
          >
            Contact Sales
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Pricing;