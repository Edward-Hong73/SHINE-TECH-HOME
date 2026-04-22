import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // DB에서 정보 확인
      const { data, error } = await supabase
        .from('members_shine')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        alert('등록되지 않은 이메일이거나 정보를 찾을 수 없습니다.');
        return;
      }

      // 로그인 성공 처리
      login({
        name: data.name,
        email: data.email,
        company: data.company_name,
        businessNumber: data.business_number,
        role: data.role
      });

      alert(`${data.name}님, 환영합니다!`);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden pt-20">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-64 w-full h-full bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-64 w-full h-full bg-brand-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl"
        >
          {/* Logo area */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 mb-6">
              <Zap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">SHINE<span className="text-brand-500 underline underline-offset-4 decoration-2">TECH</span></h1>
            <p className="text-slate-400 text-sm">고성능 PVA 솔루션 관리 시스템</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">이메일 주소</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white/10 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <button type="button" className="text-xs text-brand-500 font-bold hover:text-brand-400 transition-colors">비밀번호를 잊으셨나요?</button>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 group"
            >
              <LogIn className="w-5 h-5" />
              <span>로그인 시스템 접속</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
              <span>End-to-End 암호화된 보안 접속</span>
            </div>
            <p className="text-center text-xs text-slate-600 leading-relaxed">
              관리자 계정이 없으신가요? <br/>
              <Link to="/signup" className="text-brand-500 font-bold hover:underline">지금 바로 회원가입을 신청하세요</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
