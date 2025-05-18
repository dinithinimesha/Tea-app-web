// Header/page.js
"use client";

import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="p-3 m-4 rounded-xl text-xl font-bold text-white bg-[#2B2623]">
      {title}
    </header>
  );
};

export default Header;
