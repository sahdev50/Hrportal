import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, LogOut, Hexagon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const hrLinks = [
    {
      to: "/hr/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Employees",
    },
    {
      to: "/hr/leave",
      icon: <CalendarDays size={20} />,
      label: "Leave Management",
    },
  ];

  const employeeLinks = [
    {
      to: "/employee/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "My Profile",
    },
    {
      to: "/employee/leave",
      icon: <CalendarDays size={20} />,
      label: "Leave Requests",
    },
  ];

  const navLinks = user?.role === "hr" ? hrLinks : employeeLinks;

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex-col hidden md:flex sticky top-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Hexagon className="text-primary fill-primary-light mr-2" size={28} />
        <span className="text-xl font-bold text-primary-deep tracking-tight">
          HR - Portal
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-xl font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text-secondary hover:bg-primary-light hover:text-primary-deep"
              }`
            }
          >
            <span className="mr-3">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center cursor-pointer justify-center w-full px-3 py-2.5 rounded-xl font-medium text-text-secondary bg-background border border-border hover:bg-error/10 hover:text-error hover:border-error/20 transition-all"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
