"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_CLASSES } from "@/lib/services";
import { session } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import type { Me } from "@/lib/types";

export default function NavBar() {
  const router = useRouter();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<Me | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(session.isAuthenticated);
      
      if (session.isAuthenticated) {
        apiGet<Me>("/auth/me")
          .then((data) => setUser(data))
          .catch(() => {
            setUser(null);
            setIsAuthenticated(false);
          });
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkAuth();

    // Listen for storage events (login/logout in other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    session.clear();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pricing?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          {/* Logo removed */}
        </Link>

        {/* Search Bar - Desktop */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-md relative">
          <form onSubmit={handleSearch}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search services, platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white/50 hover:bg-white transition-colors"
            />
          </form>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">

          {/* Worker Navigation */}
          {user?.role === 'worker' ? (
            <>
              <Link
                href="/dashboard/worker"
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
              >
                Dashboard
              </Link>
              <Link
                href="/my-tasks"
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
              >
                My Tasks
              </Link>
              <Link
                href="/dashboard/earnings"
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
              >
                Earnings
              </Link>
              <Link
                href="/help"
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
              >
                Help
              </Link>
            </>
          ) : (
            <>
              {/* Client Navigation - Services mega-dropdown */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setServicesOpen((v) => !v)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                    servicesOpen ? "text-[#2563EB] bg-[#DBEAFE]" : "text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#FAFAFA]"
                  }`}
                >
                  Services
                  <svg
                    className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20" fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-white border border-neutral-200 rounded-2xl shadow-2xl p-6 z-50 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Service Categories
                      </p>
                      <Link
                        href="/pricing"
                        onClick={() => setServicesOpen(false)}
                        className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                      >
                        View all services →
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {SERVICE_CLASSES.map((cls) => (
                        <Link
                          key={cls.id}
                          href={`/pricing?class=${cls.id}`}
                          onClick={() => setServicesOpen(false)}
                          className="group flex flex-col px-4 py-3 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100"
                        >
                          <span className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-900 mb-0.5">
                            {cls.label}
                          </span>
                          <span className="text-xs text-neutral-500 leading-relaxed">
                            {cls.tagline}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* How it Works */}
              <Link
                href="/#how-it-works"
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
              >
                How it works
              </Link>

              {/* About */}
              <Link
                href="/about"
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
              >
                About
              </Link>

              {/* Cart - Only for clients */}
              {isAuthenticated && (
                <Link
                  href="/orders"
                  className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Link>
              )}
            </>
          )}

          {isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-semibold">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-neutral-900">{user.email.split('@')[0]}</span>
                <svg className={`w-4 h-4 text-neutral-600 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-2">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs text-neutral-500">Signed in as</p>
                    <p className="text-sm font-medium text-neutral-900 truncate">{user.email}</p>
                    <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user.role === 'worker' && (
                    <>
                      <Link
                        href="/my-tasks"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Tasks
                      </Link>
                      <Link
                        href="/dashboard/earnings"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Earnings
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-neutral-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/pricing"
                className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Order Now
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-2">
          {!isAuthenticated && (
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white rounded-full shadow-md"
            >
              Order
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-neutral-200 shadow-xl z-50 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>

          {/* Search */}
          <div className="px-4 pt-4 pb-3 border-b border-neutral-100">
            <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }}>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-base border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
                />
              </div>
            </form>
          </div>

          {/* Authenticated user header */}
          {isAuthenticated && user && (
            <div className="px-5 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-base font-semibold flex-shrink-0">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{user.email.split('@')[0]}</p>
                <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="py-2">
            {user?.role === 'worker' ? (
              <>
                <Link href="/dashboard/worker" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">Dashboard</Link>
                <Link href="/tasks/feed" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">Task Feed</Link>
                <Link href="/my-tasks" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">My Tasks</Link>
                <Link href="/dashboard/earnings" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">Earnings</Link>
                <Link href="/help" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">Help</Link>
              </>
            ) : (
              <>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">Services</Link>
                <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">How it works</Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">About</Link>
                {isAuthenticated && user && (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">Dashboard</Link>
                    <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">My Orders</Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors border-b border-neutral-50">Admin Panel</Link>
                    )}
                  </>
                )}
              </>
            )}
          </nav>

          {/* Auth actions */}
          <div className="px-5 py-4 border-t border-neutral-100">
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full text-center py-3 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 text-sm font-semibold text-neutral-700 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 text-sm font-bold bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Order Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
