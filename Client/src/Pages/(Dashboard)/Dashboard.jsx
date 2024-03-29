import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import Content from './Content';

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className={`w-full h-screen  ${showSidebar ? 'md:pl-64' : 'pl-20'}`}>
        <Content />
      </div>
    </>
  );
}

export default Dashboard;
