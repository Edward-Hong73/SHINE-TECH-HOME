import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Zap, LogOut, Settings as SettingsIcon, User, ChevronDown, FileText, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.products, path: '/products' },
    { name: t.nav.tech, path: '/technology' },
    { name: t.nav.contact, path: '/contact' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full z-[100] transition-all duration-300",
        scrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-md py-3 border-b border-slate-100"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            {/* LEFT GROUP: Back + Burger + Logo (Always Together) */}
            <div className="flex items-center space-x-3 shrink-0">
              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg active:scale-90 transition-all"
                  aria-label="뒤로 가기"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg active:scale-90 transition-all"
                aria-label="메뉴 열기"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:rotate-12 transition-transform">
                  <Zap className="text-white w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:block">
                  SHINE<span className="text-brand-600">TECH</span>
                </span>
              </Link>
            </div>

            {/* MIDDLE/RIGHT GROUP: All Other Menus (Together in one line) */}
            <div className="flex items-center space-x-4 ml-4">
              
              {/* Horizontal Menu Links (Visible if space permits) */}
              <div className="hidden md:flex items-center space-x-6 mr-2">
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className={cn(
                      "text-[13px] font-black transition-all hover:text-brand-600",
                      location.pathname === link.path ? "text-brand-600" : "text-slate-600"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Language + Account Settings (Always Together) */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
                  className="hidden xs:flex text-[10px] font-black bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg border border-brand-100 uppercase"
                >
                  {language === 'en' ? 'KO' : 'EN'}
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={cn(
                      "flex items-center justify-center w-11 h-11 rounded-2xl transition-all shadow-sm border",
                      isProfileOpen ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-200"
                    )}
                  >
                    <SettingsIcon className={cn("w-5 h-5", isProfileOpen && "rotate-90 transition-transform")} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden z-[110]">
                      {isLoggedIn ? (
                        <>
                          <div className="p-5 bg-slate-50/50 border-b border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">My Account</p>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold">
                                {user?.name?.[0]}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{user?.name} 님</p>
                                <p className="text-[10px] text-slate-500 font-medium">{user?.company || '개인 파트너'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-bold text-slate-600 hover:bg-brand-50 rounded-xl transition-colors">
                              <User className="w-4 h-4" />
                              <span>내 정보관리</span>
                            </Link>
                            <Link to="/quote" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-bold text-slate-600 hover:bg-brand-50 rounded-xl transition-colors">
                              <FileText className="w-4 h-4" />
                              <span>내 주문 조회</span>
                            </Link>
                            {(user?.role === 'admin' || user?.company === '샤인테크' || user?.businessNumber === '108-12-67235') && (
                              <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-bold text-brand-600 bg-brand-50 rounded-xl transition-colors">
                                <ShieldCheck className="w-4 h-4" />
                                <span>관리자 대시보드</span>
                              </Link>
                            )}
                            <div className="h-px bg-slate-50 my-2 mx-2" />
                            <button
                              onClick={async () => {
                                if(confirm('정말 로그아웃 하시겠습니까?')){
                                  await logout();
                                  setIsProfileOpen(false);
                                  navigate('/login');
                                }
                              }}
                              className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>로그아웃</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-2">
                          <div className="p-5 pb-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">My Account</p>
                            <p className="text-sm text-slate-500 font-medium">로그인이 필요합니다</p>
                          </div>
                          <Link
                            to="/login"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-bold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>로그인</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER MENU */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-white z-[999999] flex flex-col overflow-y-auto"
          style={{ height: '100dvh' }}
        >
          <div className="flex justify-between items-center px-6 h-20 border-b border-slate-50">
            <span className="text-xl font-black text-slate-400 tracking-widest">MENU</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-90 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-8 space-y-10 pb-20">
            {/* Language Selection */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Language</p>
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
                className="w-full flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-[24px]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100">
                    <Globe className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active Mode</span>
                    <span className="text-lg font-black text-slate-700">{language === 'en' ? 'English' : '한국어'}</span>
                  </div>
                </div>
                <div className="bg-brand-600 px-4 py-2 rounded-xl text-xs font-black text-white shadow-lg">
                  {language === 'en' ? 'KO' : 'EN'}
                </div>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Main Menu</p>
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center p-5 text-xl font-black rounded-[24px] transition-all",
                      location.pathname === link.path 
                        ? "bg-brand-600 text-white shadow-2xl shadow-brand-200" 
                        : "bg-slate-50 text-slate-700 active:bg-slate-100"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User Account Section Removed per user request */}
          </div>
        </div>
      )}
    </>
  );
}
