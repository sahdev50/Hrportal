import { useLocation } from "react-router-dom";
import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentPage =
    pathParts.length > 1
      ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1)
      : "Dashboard";

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center">
        <button className="md:hidden mr-4 text-text-secondary hover:text-primary">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-text-main">{currentPage}</h1>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-6">
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-56 transition-all focus:w-72"
          />
        </div>

        <button className="relative text-text-secondary hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-card">
            3
          </span>
        </button>

        <div className="flex items-center border-l border-border pl-4 lg:pl-6">
          <img
            src={
              user?.profile?.avatar ||
              `https://ui-avatars.com/api/?name=${user?.email}&background=7C3AED&color=fff`
            }
            alt="Profile"
            className="h-9 w-9 rounded-full object-cover border-2 border-primary-light bg-primary-light"
          />
          <div className="hidden md:block ml-3 text-sm">
            <p className="font-semibold text-text-main leading-tight">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </p>
            <p className="text-text-secondary text-xs capitalize font-medium mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
