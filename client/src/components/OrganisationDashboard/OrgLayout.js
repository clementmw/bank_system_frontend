import { useState } from 'react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrgSidebar from './OrgSidebar';
import HrDepartment from './Hr/HrStaff';
import FinanceDepartment from './Finance/FinanceDepartment';
import HrNav from './Hr/HrNav';
import RelationsNav from './Customer_relations/RelationsNav';

function OrgLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e' }}>
      {/* Dynamic sidebar — reads dept from localStorage automatically */}
      <OrgSidebar />

      {/* Main content area */}
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Routes>
          <Route path="/hr/*"      element={<HrNav />} />
          <Route path="/finance/*" element={<FinanceDepartment />} />
          <Route path='/customer-service/*' element={<RelationsNav/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default OrgLayout;