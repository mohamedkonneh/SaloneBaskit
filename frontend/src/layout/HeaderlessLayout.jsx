import React from 'react';
import { Outlet } from 'react-router-dom';

const HeaderlessLayout = () => {
  return (
    <main>
      <Outlet /> {/* Page content will be rendered here */}
    </main>
  );
};

export default HeaderlessLayout;
