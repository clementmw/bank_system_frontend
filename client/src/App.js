import './output.css';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import { Routes, Route } from 'react-router-dom';
import Testimonial from './pages/Testimonial';
import Contact from './pages/Contact';
import About from './components/About/About';
import User from './components/User';
import Transaction from './components/Transaction';
import TransactionForm from './components/TransactionForm';
import Account from './components/Account';
// import Frequent from './pages/Frequent';
import PageNotFound from './Reusable/PageNotFound';
import FAQSection from './components/Home/FAQSection';
import NewNav from './pages/NewNav';
import Footer from './pages/Footer';
import UserLayout from './components/UserDashboard/UserLayout';




function App() {
  

  return (
    <div className="App">
       <>
       <NewNav/>
      <Routes>
      <Route path="/" element={<Home />} /> 
        <Route path = '/register' element={<Register/>}/>
        <Route path= '/login' element={<Login />}/>
        <Route path = '/testimonial' element={<Testimonial/>}/>
        <Route path = '/contact' element={<Contact/>}/>
        <Route path = '/about' element={<About/>}/>
        <Route path='/user' element = {<User/>}/>
        <Route path='/transaction' element = {<Transaction/>}/>
        <Route path = '/transfer' element = {<TransactionForm/>}/>
        <Route path = '/newaccount' element = {<Account/>}/>
        <Route path='/FrequentQA' element = {<FAQSection/>}/>
        
        {/* authenticated routes */}
        <Route path='/user/*' element={<UserLayout/>}/>
        
        <Route path = '*' element = {<PageNotFound/>}/>

      </Routes>
      <Footer/>
       </>
    </div>
  );
}

export default App;
