import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  FileText, 
  Briefcase, 
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Profile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    businessNumber: '',
    rank: '',
    jobTitle: '',
    companyPhone: ''
  });

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    console.log('--- Profile Page Loaded ---');
    console.log('Current User Status:', user);

    // 로그인이 이미 되어 있는 상태인 경우
    if (user?.email) {
      console.log('User found, fetching data...');
      fetchUserData();
    } else {
      // 잠깐 기다려봐도 유저 정보가 없으면 로그인으로 이동
      const timer = setTimeout(() => {
        if (!user?.email) {
          console.log('No user session found after timeout, redirecting to login...');
          navigate('/login');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('members_shine')
        .select('*')
        .eq('email', user?.email)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          companyName: data.company_name || '',
          businessNumber: data.business_number || '',
          rank: data.rank || '',
          jobTitle: data.job_title || '',
          companyPhone: data.company_phone || ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setMessage({ type: 'error', text: '데이터를 불러오는 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'newPassword' || name === 'confirmPassword') {
      setPasswords(prev => ({ ...prev, [name]: value }));
      return;
    }

    let formattedValue = value;
    if (name === 'phone' || name === 'companyPhone') {
      formattedValue = value.replace(/[^\d]/g, '');
      if (formattedValue.length > 3 && formattedValue.length <= 7) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3)}`;
      } else if (formattedValue.length > 7) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 7)}-${formattedValue.slice(7, 11)}`;
      }
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    // 비밀번호 체크
    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: '비밀번호가 서로 일치하지 않습니다.' });
      setIsSaving(false);
      return;
    }

    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
        company_name: formData.companyName,
        rank: formData.rank,
        job_title: formData.jobTitle,
        company_phone: formData.companyPhone
      };

      if (passwords.newPassword) {
        updateData.password = passwords.newPassword;
      }

      const { error } = await supabase
        .from('members_shine')
        .update(updateData)
        .eq('email', formData.email);

      if (error) throw error;

      // Update Auth context
      login({
        ...user,
        name: formData.name,
        company: formData.companyName,
        businessNumber: formData.businessNumber,
        role: formData.rank
      });

      setMessage({ type: 'success', text: '회원 정보 및 비밀번호가 성공적으로 수정되었습니다!' });
      setPasswords({ newPassword: '', confirmPassword: '' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error('Error updating user data:', err);
      setMessage({ type: 'error', text: '정보 수정 중 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden py-32">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-64 w-full h-full bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-64 w-full h-full bg-brand-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            돌아가기
          </button>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">내 정보 수정</h1>
              <p className="text-slate-400">샤인테크 파트너 포탈의 회원 정보를 관리하세요.</p>
            </div>
            <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center border border-brand-500/30">
              <User className="w-8 h-8 text-brand-500" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Group */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-xs font-bold text-brand-500 uppercase tracking-widest flex items-center">
                <User className="w-3 h-3 mr-2" />
                개인 정보
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">이름</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="text" name="name" required
                      value={formData.name} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">이메일 (ID)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="email" readOnly
                      value={formData.email}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-white/5 rounded-xl text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 px-1 italic">* 이메일은 변경할 수 없습니다.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">개인 연락처</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="tel" name="phone" required
                      value={formData.phone} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Group */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-xs font-bold text-brand-500 uppercase tracking-widest flex items-center">
                <Building2 className="w-3 h-3 mr-2" />
                회사 정보
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">소속 회사명</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="text" name="companyName" required
                      value={formData.companyName} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">사업자 등록번호</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="text" readOnly
                      value={formData.businessNumber}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-white/5 rounded-xl text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">직급</label>
                    <input 
                      type="text" name="rank" required
                      value={formData.rank} onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">직책</label>
                    <input 
                      type="text" name="jobTitle" required
                      value={formData.jobTitle} onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">회사 연락처</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="tel" name="companyPhone" required
                      value={formData.companyPhone} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Security Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            <h3 className="text-xs font-bold text-brand-500 uppercase tracking-widest flex items-center">
              <Lock className="w-3 h-3 mr-2" />
              비밀번호 보안
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">새 비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input 
                    type="password" name="newPassword"
                    placeholder="변경을 원할 때만 입력하세요"
                    value={passwords.newPassword} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">비밀번호 확인</label>
                <div className="relative">
                  <Lock className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    passwords.confirmPassword ? (passwords.newPassword === passwords.confirmPassword ? "text-emerald-500" : "text-red-500") : "text-slate-500"
                  )} />
                  <input 
                    type="password" name="confirmPassword"
                    placeholder="새 비밀번호를 다시 입력하세요"
                    value={passwords.confirmPassword} onChange={handleChange}
                    className={cn(
                      "w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 transition-all",
                      passwords.confirmPassword && (passwords.newPassword === passwords.confirmPassword ? "focus:ring-emerald-500/50 border-emerald-500/30" : "focus:ring-red-500/50 border-red-500/30")
                    )}
                  />
                </div>
                {passwords.confirmPassword && (
                  <p className={cn(
                    "text-[10px] px-1 font-bold",
                    passwords.newPassword === passwords.confirmPassword ? "text-emerald-500" : "text-red-500"
                  )}>
                    {passwords.newPassword === passwords.confirmPassword ? "✓ 비밀번호가 일치합니다." : "✗ 비밀번호가 일치하지 않습니다."}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl backdrop-blur-md",
                    message.type === 'success' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                  )}
                >
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isSaving}
              className="group relative w-full md:w-64 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>정보 저장하기</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
