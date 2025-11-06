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




function App() {
  

  return (
    <div className="App">
       
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
        {/* <Route path='/FrequentQA' element = {<Frequent/>}/> */}

        <Route path = '*' element = {<PageNotFound/>}/>

      </Routes>
    </div>
  );
}

export default App;
