import React from 'react';
import Footer from '../../pages/Footer';
import NewNav from '../../pages/NewNav';
import CTASection from '../Home/CTASection';
import MissionVision from './MissionVision';
import DataProtectionSection from './DataProtectionSection';
// import backgroundImage from '../images/backgroundImage.jpg';

function About() {
  return (
    <div>
      <NewNav/>
      {/* Hero Section */}
      <section className="relative mt-4">
        <img
        alt=' evergreen bank'
        className="absolute inset-0 h-full w-full object-cover" 
        src='https://images.unsplash.com/photo-1509470475192-4516c145f8a1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        loading='lazy'
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative mx-auto max-w-screen-2xl px-4 py-32 sm:px-6 lg:h-90 lg:items-center lg:px-8">
          <div className="max-w-xl text-center  ltr:sm:text-left rtl:sm:text-right text-white">
            <h1 className="text-3xl font-extrabold sm:text-5xl">About Us</h1>
          </div>
        </div>
      </section>
  {/* Our History Section */}
  {/* <section className="bg-white py-16">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#228B22] sm:text-4xl">Our History</h2>
          <p className="mt-4 text-gray-600">Evergreen Bank was founded in 2001 with the vision of creating a bank that prioritizes customer service and sustainable practices. Over the years, we have grown significantly, but our core values remain the same. We believe that a bank should be transparent, accessible, and dedicated to providing an exceptional customer experience.</p>
          <div className="mt-8 space-y-6">
            <div className="flex items-start">
              <span className="shrink-0 rounded-full bg-[#228B22] p-2 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </span>
              <div className="ml-4">
                <h3 className="text-lg font-bold">2001: Foundation</h3>
                <p className="mt-1 text-gray-600">Evergreen Bank was established with a commitment to providing top-notch banking services while emphasizing environmental sustainability. Our founders believed in the importance of a bank that not only serves its customers but also the planet.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="shrink-0 rounded-full bg-[#228B22] p-2 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </span>
              <div className="ml-4">
                <h3 className="text-lg font-bold">2005: First Green Initiative</h3>
                <p className="mt-1 text-gray-600">We launched our first major green initiative by partnering with local communities to promote renewable energy projects. This initiative helped us reduce our carbon footprint and support sustainable development.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="shrink-0 rounded-full bg-[#228B22] p-2 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </span>
              <div className="ml-4">
                <h3 className="text-lg font-bold">2010: Nationwide Expansion</h3>
                <p className="mt-1 text-gray-600">By 2010, Evergreen Bank had expanded its services nationwide, opening new branches in key locations. Our growth was driven by a commitment to providing exceptional customer service and innovative banking solutions.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="shrink-0 rounded-full bg-[#228B22] p-2 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </span>
              <div className="ml-4">
                <h3 className="text-lg font-bold">2015: Digital Transformation</h3>
                <p className="mt-1 text-gray-600">We embraced the digital age by introducing an online banking platform that offered our customers a seamless and convenient banking experience. This transformation allowed us to serve a wider audience with greater efficiency.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="shrink-0 rounded-full bg-[#228B22] p-2 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </span>
              <div className="ml-4">
                <h3 className="text-lg font-bold">2021: Award-Winning Service</h3>
                <p className="mt-1 text-gray-600">Evergreen Bank was recognized for its outstanding customer service and innovative banking solutions. We received several awards that highlighted our commitment to excellence and sustainability.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="shrink-0 rounded-full bg-[#228B22] p-2 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </span>
              <div className="ml-4">
                <h3 className="text-lg font-bold">2024: Leading the Way in Green Banking</h3>
                <p className="mt-1 text-gray-600">Today, Evergreen Bank continues to lead the industry in green banking initiatives. We are dedicated to creating a sustainable future through innovative financial products and services that benefit both our customers and the environment.</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Our Mission Section */}
      <MissionVision/>
      <DataProtectionSection/>

      <CTASection/>

      

      
      <Footer/>
    </div>
  );
}

export default About;
