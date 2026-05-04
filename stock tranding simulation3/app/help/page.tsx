'use client';

import { useState } from 'react';

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
    { id: 'trading', label: 'Trading', icon: '📈' },
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'technical', label: 'Technical', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'How do I create an account?',
        answer: 'To create an account, click on the Sign Up button on the homepage. Fill in your personal information, verify your email, and complete the identity verification process.'
      },
      {
        question: 'What documents do I need for verification?',
        answer: 'You will need a government-issued ID (passport, driver\'s license, or national ID) and proof of address (utility bill or bank statement from the last 3 months).'
      },
      {
        question: 'How long does verification take?',
        answer: 'Standard verification usually takes 1-2 business days. Express verification is available for premium accounts and typically takes a few hours.'
      }
    ],
    'trading': [
      {
        question: 'What are the trading hours?',
        answer: 'Stock market hours are 9:30 AM to 4:00 PM ET, Monday through Friday. Cryptocurrency markets are open 24/7.'
      },
      {
        question: 'What order types are available?',
        answer: 'We support Market, Limit, Stop Loss, Stop Limit, SL-M (Stop Loss Market), and Cover Order types.'
      },
      {
        question: 'What are MIS, CNC, and NRML products?',
        answer: 'MIS (Margin Intraday Square-off) for intraday trading with 20% margin, CNC (Cash and Carry) for delivery trades, and NRML (Normal) for overnight positions with 40% margin.'
      }
    ],
    'account': [
      {
        question: 'How do I deposit funds?',
        answer: 'Go to the Portfolio page and click on "Add Funds". You can deposit via bank transfer, credit/debit card, or cryptocurrency.'
      },
      {
        question: 'What are the withdrawal limits?',
        answer: 'Standard users can withdraw up to $10,000 per day. Premium users have higher limits based on their verification level.'
      },
      {
        question: 'How do I update my personal information?',
        answer: 'Navigate to Profile > Edit Profile to update your personal information. Some changes may require re-verification.'
      }
    ],
    'technical': [
      {
        question: 'What browsers are supported?',
        answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome or Firefox.'
      },
      {
        question: 'Is there a mobile app?',
        answer: 'Yes, our mobile app is available for both iOS and Android. Download it from the App Store or Google Play Store.'
      },
      {
        question: 'How do I enable two-factor authentication?',
        answer: 'Go to Settings > Security > Two-Factor Authentication. You can use SMS, authenticator apps, or hardware keys.'
      }
    ],
    'security': [
      {
        question: 'How is my data protected?',
        answer: 'We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. All sensitive data is encrypted and stored securely.'
      },
      {
        question: 'What should I do if I suspect unauthorized access?',
        answer: 'Immediately change your password, enable 2FA if not already enabled, and contact our support team at support@tradingsim.com'
      },
      {
        question: 'Are my funds insured?',
        answer: 'Yes, all customer funds are held in segregated accounts and are protected by SIPC insurance up to $500,000.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Help Center</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4">
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-4 mt-6">
              <h3 className="text-white font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white text-sm">
                  📧 Contact Support
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white text-sm">
                  📞 Call Support
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white text-sm">
                  💬 Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              
              <div className="space-y-4">
                {faqs[activeCategory as keyof typeof faqs]?.map((faq, index) => (
                  <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      <span className="text-gray-400">
                        {expandedFAQ === index ? '▼' : '▶'}
                      </span>
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-4 py-4 bg-gray-800/50 border-t border-gray-800">
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="glass-card p-6 mt-8">
              <h2 className="text-xl font-bold text-white mb-6">Still Need Help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📧</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">Email Support</h3>
                  <p className="text-gray-400 text-sm mb-4">Get help via email</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Send Email
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">💬</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">Live Chat</h3>
                  <p className="text-gray-400 text-sm mb-4">Chat with our team</p>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Start Chat
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📞</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">Phone Support</h3>
                  <p className="text-gray-400 text-sm mb-4">Call us directly</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
