"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ChartColumn, UserRoundPen, LogOut } from "lucide-react";
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlineProduct } from "react-icons/ai";
import { IoReorderFour } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoLogOutSharp } from "react-icons/io5";
import Image from 'next/image';
import Logo from '@/src/Logo.png';

const Sidebar = () => {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    // Automatically expand the menu based on current route
    const matchedMenu = links.find((link) =>
      link.subMenu && pathname.startsWith(link.href)
    );
    if (matchedMenu) {
      setOpenMenu(matchedMenu.label);
    }
  }, [pathname]);

  const router = useRouter();

  const links = [
    { href: "/admindashboard", label: "Dashboard", icon: <BiSolidDashboard /> },
    { href: "/admindashboard/Products", label: "Products", icon: <AiOutlineProduct /> },
    { href: "/admindashboard/Orders", label: "Orders", icon: <IoReorderFour /> },
    { href: "/admindashboard/Profile", label: "Profile", icon: <CgProfile /> },
  ];

  const isActive = (path) => pathname === path;

  return (
    <div className="w-20 h-screen p-4 text-gray-300 bg-[#2B2623] md:w-60 flex flex-col items-center">
  <Image src={Logo} alt="aroma" width={100} height={50} />
  <h1 className="mb-10 mt-2 hidden md:block text-center text-xl font-bold text-[#77FF95]">
    AROMA
  </h1>
  <ul className="space-y-4 w-full">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`flex gap-3 p-2 rounded hover:bg-[#3d3632] hover:text-[#77FF95] ${
                isActive(link.href) ? "text-[#77FF95] font-bold" : ""
              }`}
            >
              {link.icon}
              <span className="hidden md:flex">{link.label}</span>
            </Link>
          </li>
        ))}
        
      </ul>
    </div>
  );
};

export default Sidebar;
