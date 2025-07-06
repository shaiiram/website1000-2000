

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Home, Map, Calendar, Phone, LogIn, LogOut, User as UserIcon, Shield, Briefcase, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setIsAdmin(currentUser.role === 'admin');
      } catch (error) {
        setUser(null);
        setIsAdmin(false);
      }
    };
    fetchUser();
  }, [location.pathname]);

  const handleLogin = async () => {
    await User.login();
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    setIsAdmin(false);
    navigate(createPageUrl("Home"));
  };
  
  const showHeader = currentPageName !== 'Home';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Karantina:wght@700&display=swap');
          
          body, * {
            font-family: 'Assistant', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .font-tiktok {
            font-family: 'Karantina', cursive;
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          
          .sherry-glow {
            box-shadow: 0 8px 32px 0 rgba(212, 165, 116, 0.15);
          }
        `}
      </style>

      {showHeader && (
        <header className="sticky top-0 z-40 glass-effect border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
                 <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center sherry-glow">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    1000-2000
                  </h1>
                </div>
              </Link>
              
              <div className="flex items-center space-x-4">
                {user ? (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <span className="hidden sm:inline">היי, {user.full_name.split(' ')[0]}</span>
                        <UserCircle className="w-6 h-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" dir="rtl">
                      <DropdownMenuLabel>החשבון שלי</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Profile")} className="flex items-center gap-2 cursor-pointer w-full">
                          <UserIcon className="w-4 h-4" />
                          <span>הפרופיל שלי</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("MyBookings")} className="flex items-center gap-2 cursor-pointer w-full">
                          <Briefcase className="w-4 h-4" />
                          <span>ההזמנות שלי</span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                         <DropdownMenuItem asChild>
                           <Link to={createPageUrl("Admin")} className="flex items-center gap-2 cursor-pointer w-full">
                             <Shield className="w-4 h-4" />
                             <span>פאנל ניהול</span>
                           </Link>
                         </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500 w-full">
                        <LogOut className="w-4 h-4" />
                        <span>יציאה</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={handleLogin} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 sherry-glow flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>כניסה</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Footer */}
      {showHeader && (
        <footer className="bg-gray-800 text-white pt-12 pb-8">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                <div className="col-span-2 md:col-span-1">
                  <h4 className="font-bold mb-3">ניווט</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><Link to={createPageUrl("Home")} className="hover:text-amber-400">בית</Link></li>
                    <li><Link to={createPageUrl("MyBookings")} className="hover:text-amber-400">ההזמנות שלי</Link></li>
                  </ul>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h4 className="font-bold mb-3">מידע</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><Link to={createPageUrl("Accessibility")} className="hover:text-amber-400">הצהרת נגישות</Link></li>
                    <li><Link to={createPageUrl("Security")} className="hover:text-amber-400">אבטחת מידע</Link></li>
                    <li><Link to={createPageUrl("Privacy")} className="hover:text-amber-400">פרטיות ושימוש</Link></li>
                  </ul>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h4 className="font-bold mb-3">תמיכה</h4>
                   <ul className="space-y-2 text-gray-300">
                    <li><Link to={createPageUrl("Contact")} className="hover:text-amber-400">יצירת קשר</Link></li>
                  </ul>
                </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} 1000-2000. כל הזכויות שמורות.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

