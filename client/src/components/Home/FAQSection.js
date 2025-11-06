import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

function FAQSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const faqs = [
    {
      question: "How do I open an account?",
      answer: "To open an account, visit our nearest branch with a valid ID, proof of address, and a minimum deposit of Ksh 1000. You can also start the process online by filling out our application form on the 'Open Account' page."
    },
    {
      question: "How do I open an account online?",
      answer: "To open an account online, visit the 'Open Account' page, fill out the required information, and submit the form. Our team will review your application and contact you with the next steps."
    },
    {
      question: "What are the current interest rates?",
      answer: "Our current interest rates vary based on the type of account and the balance. For the most up-to-date rates, please visit our Rates page or contact our customer service."
    },
    {
      question: "How can I apply for a loan?",
      answer: "To apply for a loan, you need to provide your personal information, employment details, and financial history. You can apply online or visit any of our branches for assistance."
    },
    {
      question: "How do I reset my online banking password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page, enter your registered email, and follow the instructions sent to your email."
    },
    {
      question: "What fees do you charge for account maintenance?",
      answer: "We offer various account types with different fee structures. For detailed information on fees, please refer to our Fee Schedule page or contact customer service."
    },
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div 
          className={`text-center mb-16 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-4">
            FAQ
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-emerald-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our banking services
          </p>
        </div>

        {/* FAQ Items */}
        <div 
          className={`space-y-4 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  {openIndex === index ? (
                    <FaMinus size={14} />
                  ) : (
                    <FaPlus size={14} />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div 
          className={`mt-12 text-center transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;