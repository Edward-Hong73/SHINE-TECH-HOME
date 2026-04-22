import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, ArrowRight, Mail, ShieldCheck } from 'lucide-react';

export default function SignupSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-64 w-full h-full bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-64 w-full h-full bg-brand-900/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[48px] p-8 md:p-16 text-center shadow-3xl overflow-hidden relative"
      >
        {/* Success Animation Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--brand-500)_0%,_transparent_70%)]" />

        <div className="relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-500/40"
          >
            <CheckCircle2 className="text-white w-10 h-10" />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
          >
            샤인테크의 소중한 <br/>
            <span className="text-brand-500">파트너가 되신 것을 환영합니다!</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg mb-12 leading-relaxed"
          >
            회원가입 신청이 성공적으로 접수되었습니다. <br/>
            현재 관리자 승인 대기 중이며, 승인이 완료되는 대로 <br/>
            가입하신 이메일로 안내 메일을 발송해 드립니다.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button 
              onClick={() => navigate('/login')}
              className="py-4 px-8 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 group"
            >
              <span>로그인 화면으로</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="py-4 px-8 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 border border-white/10 transition-all backdrop-blur-sm"
            >
              메인 홈페이지
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex items-center justify-center space-x-6 pt-8 border-t border-white/5"
          >
            <div className="flex items-center text-[10px] uppercase tracking-widest font-bold text-slate-500">
              <Mail className="w-3.5 h-3.5 mr-2" />
              승인 확인 메일 발송 중
            </div>
            <div className="flex items-center text-[10px] uppercase tracking-widest font-bold text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 mr-2 text-green-500" />
              보안 인증 완료
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
