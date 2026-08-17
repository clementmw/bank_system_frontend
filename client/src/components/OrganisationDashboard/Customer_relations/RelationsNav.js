import React from 'react'
import { Route, Routes } from 'react-router-dom';
import CRDashboard from './CRDashboard';
import TicketsRV from './TicketsRV';
import KycReview from './KycReview';


function RelationsNav() {
  return (
    <Routes>
        <Route path='/' element={<CRDashboard/>}/>
        <Route path='/tickets' element={<TicketsRV/>}/>
        <Route path='/kyc-review' element={<KycReview/>}/>
       
    </Routes>
  )
}

export default RelationsNav