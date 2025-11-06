import axios from 'axios';
import { useState } from 'react';
import NewNav from './NewNav';
import Footer from './Footer';
// import toast,{Toaster} from 'react-hot-toast'

function Contact() {
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
      axios.post('/contact', { full_name, email, message })
      .then(()=>{
      setFullName('');
      setEmail('');
      setMessage('')
      setError('')

      setSuccess("Message successfully sent")
      }) 
      .catch((error)=>{
        const errorMsg = error.response?.data?.error || 'An error occurred';
        setError(errorMsg);
      })
  };

  return (
    <div>
      <NewNav />
      {/* Hero Section */}
      <section className="relative mt-4">
        <img
          alt="Evergreen Bank"
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1509470475192-4516c145f8a1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative mx-auto max-w-screen-2xl px-4 py-32 sm:px-6 lg:h-50 lg:items-center lg:px-8">
          <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right text-white">
            <h1 className="text-3xl font-extrabold sm:text-5xl">Contact Us</h1>
            <p className="mt-4 sm:mt-8 text-lg sm:text-xl">
              We are here to help you with any questions or concerns you may have.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative flex flex-wrap lg:h-screen lg:items-center bg-gray-100">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Get in Touch with Us</h1>
            <p className="mt-4 text-gray-600">
              If you have any questions or need assistance, please fill out the form below and we will get back to you shortly.
            </p>
            <div className='mt-4'>
            {error && <p className='text-red-500'>{error}</p>}
            {success && <p className='text-green-600'>{success}</p>}
            </div>
            
          </div>
  

          <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">

            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:ring focus:ring-lime-500"
                  placeholder="Enter your full name"
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
               
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <div className="relative">
                <textarea
                  id="message"
                  rows="4"
                  className="w-full rounded-lg border-gray-300 p-4 text-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-200 text-black p-4 text-lg font-medium shadow-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="relative h-64 w-full sm:h-80 lg:h-3/4 lg:w-1/2">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>
      {/* <Toaster position='top-center' reverseOrder={false}/> */}

      <Footer />
    </div>
  );
}

export default Contact;
