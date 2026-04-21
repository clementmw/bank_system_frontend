import { Route, Routes } from 'react-router-dom';
import React from 'react'
import HrDashboard from './HrDashboard';
import HrProfile from './HrProfile';
import HrRecruitment from './HrRecruitment';
import HrStaff from './HrStaff';
import HrOnboarding from './HrOnboarding';


function HrNav() {
  return (
    <Routes>
        <Route path="/" element={<HrDashboard/>} />
        <Route path="/staff" element={<HrStaff/>} />
        <Route path="/profile" element={<HrProfile/>} />
        <Route path="/onboarding" element={<HrOnboarding/>} />


    </Routes>
  )
}

export default HrNav