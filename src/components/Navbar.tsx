import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Zap, LogOut, Settings as SettingsIcon, User, Building2, Mail, ChevronDown, FileText, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Mobile Left: Hamburger (Reordered: Menu first) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-md transition-colors",
                scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
              )}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Back Button Group */}
          <div className="flex items-center space-x-2">
            {/* Back Button (Only show if not on home) */}
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate('/')}
                className={cn(
                  "p-2 rounded-xl transition-all flex items-center justify-center group",
                  scrolled ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                )}
                title="홈으로 가기"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-2 bg-slate-900/10 hover:bg-slate-900/20 px-3 py-1.5 rounded-xl transition-colors backdrop-blur-sm">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className={cn(
                "text-lg font-bold tracking-tighter",
                scrolled ? "text-slate-900" : "text-slate-100"
              )}>
                SHINE<span className="text-brand-500 underline underline-offset-4 decoration-2">TECH</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-500",
                  location.pathname === link.path 
                    ? "text-brand-600" 
                    : scrolled ? "text-slate-600" : "text-white/90"
                )}
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
              className="flex items-center space-x-1 text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'KO' : 'EN'}</span>
            </button>
          </div>

          {/* User Account/Settings Section */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
              className={cn(
                "md:hidden p-2 rounded-xl transition-all",
                scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
              )}
            >
              <Globe className="w-5 h-5" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all border shadow-sm",
                  scrolled 
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
                )}
              >
                <SettingsIcon className={cn("w-4 h-4", !scrolled && "text-brand-400")} />
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Account</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform opacity-50", isProfileOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
                  >
                    <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">회원 정보</p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-slate-600">
                          <User className="w-4 h-4 text-brand-500" />
                          <span className="text-sm font-semibold">{user?.name || (isLoggedIn ? '사용자' : '로그인 필요')}</span>
                        </div>
                        {isLoggedIn && (
                          <>
                            <div className="flex items-center space-x-3 text-slate-500">
                              <Building2 className="w-4 h-4" />
                              <span className="text-xs truncate">{user?.company || '개인 파트너'}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-500">
                              <ShieldCheck className="w-4 h-4" />
                              <span className="text-[10px] uppercase font-bold tracking-tight bg-slate-100 px-1.5 py-0.5 rounded">{user?.role || 'user'}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-2">
                      {isLoggedIn ? (
                        <>
                          <Link 
                            to="/profile" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition-colors"
                          >
                            <SettingsIcon className="w-4 h-4" />
                            <span>내 정보 수정</span>
                          </Link>

                          <Link 
                            to="/quote" 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition-colors"
                          >
                            <Zap className="w-4 h-4" />
                            <span>주문 대시보드</span>
                          </Link>

                          {(user?.role === 'admin' || user?.company === '샤인테크' || user?.businessNumber === '108-12-67235') && (
                            <Link 
                              to="/admin" 
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>관리자 전용 메뉴</span>
                            </Link>
                          )}

                          <div className="h-px bg-slate-50 my-2 mx-2" />
                          
                          <button 
                            onClick={() => {
                              if (confirm('로그아웃 하시겠습니까?')) {
                                logout();
                                setIsProfileOpen(false);
                                navigate('/');
                              }
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>로그아웃</span>
                          </button>
                        </>
                      ) : (
                        <div className="p-1 space-y-1">
                          <Link 
                            to="/login"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-center w-full py-3 text-sm font-bold text-white bg-brand-600 rounded-xl shadow-lg shadow-brand-200"
                          >
                            로그인
                          </Link>
                          <Link 
                            to="/signup"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-center w-full py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl"
                          >
                            회원가입
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu (Simplified) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Navigation</p>
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-4 text-base font-semibold rounded-xl transition-all",
                    location.pathname === link.path 
                      ? "text-brand-600 bg-brand-50" 
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {!isLoggedIn && (
                <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center py-4 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl"
                  >
                   로그인
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center py-4 text-sm font-bold text-white bg-brand-600 rounded-xl"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
