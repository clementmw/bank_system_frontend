import './output.css';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import { Routes, Route, useLocation } from 'react-router-dom';
import Testimonial from './pages/Testimonial';
import Contact from './pages/Contact';
import About from './components/About/About';
import User from './components/User';
import Transaction from './components/Transaction';
import TransactionForm from './components/TransactionForm';
import Account from './components/Account';
import PageNotFound from './Reusable/PageNotFound';
import FAQSection from './components/Home/FAQSection';
import NewNav from './pages/NewNav';
import Footer from './pages/Footer';
import UserLayout from './components/UserDashboard/UserLayout';
import { useState, useEffect } from 'react';

function App() {
  const [authenticated, setisAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setisAuthenticated(true);
    }
  }, []);

  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/user-dashboard');

  // Check if current route should show public nav and footer
  const showPublicLayout = !isDashboardRoute;

  return (
    <div className="App">
      {/* Show public navigation only on public pages */}
      {showPublicLayout && <NewNav />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/user" element={<User />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/transfer" element={<TransactionForm />} />
        <Route path="/newaccount" element={<Account />} />
        <Route path="/FrequentQA" element={<FAQSection />} />

        {/* Authenticated Routes - UserLayout handles its own navigation */}
        <Route path="/user-dashboard/*" element={<UserLayout />} />

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* Show footer only on public pages */}
      {showPublicLayout && <Footer />}
    </div>
  );
}

export default App;