import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // Adjust path if needed

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Page content will be rendered here */}
      </main>
    </>
  );
};

export default MainLayout;
