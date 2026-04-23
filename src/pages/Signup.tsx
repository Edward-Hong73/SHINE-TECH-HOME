import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  Zap,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [isManualInput, setIsManualInput] = useState(false);
  const [businessError, setBusinessError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    businessNumber: '',
    rank: '',
    jobTitle: '',
    companyPhone: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies_shine')
      .select('*')
      .order('company_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data || []);
    }
  };

  const formatBusinessNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    if (number.length <= 3) return number;
    if (number.length <= 5) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 5)}-${number.slice(5, 10)}`;
  };

  const formatPhoneNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    if (number.length <= 3) return number;
    if (number.length <= 7) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'businessNumber') {
      formattedValue = formatBusinessNumber(value);
    } else if (name === 'phone' || name === 'companyPhone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });

    // 사업자 번호 입력 시 실시간 중복 체크
    if (name === 'businessNumber') {
      if (formattedValue.length === 12) { // 000-00-00000 포맷 완료 시
        checkBusinessNumber(formattedValue);
      } else {
        setBusinessError('');
      }
    }
  };

  const checkBusinessNumber = async (number: string) => {
    setIsChecking(true);
    const { data, error } = await supabase
      .from('companies_shine')
      .select('id')
      .eq('business_number', number)
      .maybeSingle();

    setIsChecking(false);
    if (data) {
      setBusinessError('이미 등록된 사업자 번호입니다.');
    } else {
      setBusinessError('');
    }
  };

  const handleCompanySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bizNum = e.target.value;
    
    if (bizNum === 'manual') {
      setIsManualInput(true);
      setFormData({
        ...formData,
        companyName: '',
        businessNumber: '',
        companyPhone: ''
      });
      return;
    }

    setIsManualInput(false);
    const selectedCompany = companies.find(c => c.business_number === bizNum);
    if (selectedCompany) {
      setFormData({
        ...formData,
        companyName: selectedCompany.company_name,
        businessNumber: selectedCompany.business_number,
        companyPhone: selectedCompany.company_phone || ''
      });
    } else {
      setFormData({
        ...formData,
        companyName: '',
        businessNumber: '',
        companyPhone: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('--- Signup Submit Started ---');
    console.log('Form Data:', formData);

    if (businessError) {
      console.warn('Business validation error exists');
      alert('사업자 번호를 확인해주세요.');
      return;
    }
    
    // 1. 직접 입력 모드일 때만 새로운 고객사 등록
    if (isManualInput) {
      const { error: companyError } = await supabase
        .from('companies_shine')
        .insert([
          { 
            company_name: formData.companyName, 
            business_number: formData.businessNumber, 
            company_phone: formData.companyPhone 
          }
        ]);

      if (companyError && companyError.code !== '23505') { // 중복은 허용 (이미 등록되었을 수도 있음)
        alert('회사 정보 저장 중 오류가 발생했습니다: ' + companyError.message);
        return;
      }
    }

    // 2. 회원 개인 정보 저장
    const { error: memberError } = await supabase
      .from('members_shine')
      .insert([
        { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password,
          phone: formData.phone,
          company_name: formData.companyName,
          business_number: formData.businessNumber,
          rank: formData.rank,
          job_title: formData.jobTitle,
          company_phone: formData.companyPhone
        }
      ]);

    if (memberError) {
      if (memberError.code === '23505') {
        alert('이미 가입된 이메일 주소입니다.');
      } else {
        alert('회원 가입 중 오류가 발생했습니다: ' + memberError.message);
      }
      return;
    }

    // 가입 성공 팝업
    alert(`🎉 가입을 축하합니다!\n\n${formData.name}님, 샤인테크의 소중한 파트너가 되신 것을 진심으로 환영합니다.`);

    // 가입 즉시 자동 로그인 처리
    console.log('Logging in user...');
    login({
      name: formData.name,
      email: formData.email,
      company: formData.companyName,
      businessNumber: formData.businessNumber,
      role: formData.rank
    });
    console.log('Logged in successfully, moving to home.');

    // 홈 화면으로 즉시 이동
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden py-20 flex items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-64 w-full h-full bg-brand-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-64 w-full h-full bg-brand-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-10">
            <Link to="/login" className="inline-flex items-center text-brand-500 text-sm font-bold mb-6 hover:text-brand-400 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              로그인으로 돌아가기
            </Link>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
                <Zap className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">회원가입 신청</h1>
                <p className="text-slate-400 text-sm">샤인테크 파트너 포탈 가입을 환영합니다.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">개인 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">이름</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="text" name="name" required placeholder="홍길동"
                      value={formData.name} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">아이디 (이메일)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="email" name="email" required placeholder="user@company.com"
                      value={formData.email} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="password" name="password" required placeholder="••••••••"
                      value={formData.password} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">개인 연락처</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="tel" name="phone" required placeholder="010-0000-0000"
                      value={formData.phone} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Company Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">회사 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 사업자 등록번호 (순서 변경 및 수정을 위해 위로 올림) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    소속회사 사업자 등록번호 {isManualInput ? '(직접입력)' : '(자동입력)'}
                  </label>
                  {!isManualInput && (
                    <div className="relative mb-3">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 z-10" />
                      <select 
                        required={!isManualInput}
                        value={formData.businessNumber} 
                        onChange={handleCompanySelect}
                        className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900">사업자 등록번호를 선택하세요</option>
                        {companies.map((c) => (
                          <option key={c.id} value={c.business_number} className="bg-slate-900">
                            {c.business_number} ({c.company_name})
                          </option>
                        ))}
                        <option value="manual" className="bg-slate-800 font-bold text-brand-400 border-t border-white/10">+ 목록에 없음 (직접 입력)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  )}

                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="text" 
                      name="businessNumber" 
                      required
                      readOnly={!isManualInput}
                      placeholder={isManualInput ? "000-00-00000" : "위 목록에서 번호를 선택해 주세요"}
                      value={formData.businessNumber} 
                      onChange={isManualInput ? handleChange : undefined}
                      className={cn(
                        "w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none transition-all",
                        businessError 
                          ? "bg-red-500/10 border-red-500/50 text-red-200"
                          : isManualInput 
                            ? "bg-brand-500/10 border-brand-500/30 text-white focus:ring-2 focus:ring-brand-500/50" 
                            : "bg-white/5 border-white/10 text-slate-400 cursor-not-allowed"
                      )}
                    />
                    {isChecking && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  {businessError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-red-500 font-bold mt-1 px-1"
                    >
                      {businessError}
                    </motion.p>
                  )}
                </div>

                {/* 소속 회사명 (순서 변경 및 수정을 위해 아래로 내림) */}
                <div className="space-y-1.5 overflow-hidden">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    소속 회사명 {!isManualInput && <span className="text-brand-500 font-bold">(자동채움)</span>}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="text" 
                      name="companyName" 
                      required 
                      readOnly={!isManualInput}
                      placeholder={isManualInput ? "정확한 회사명을 입력하세요" : "사업자 번호를 선택하면 자동 입력됩니다"}
                      value={formData.companyName} 
                      onChange={handleChange}
                      className={cn(
                        "w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none transition-all",
                        isManualInput 
                          ? "bg-brand-500/10 border-brand-500/30 text-white focus:ring-2 focus:ring-brand-500/50" 
                          : "bg-white/5 border-white/10 text-slate-400 cursor-not-allowed"
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">직급</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="text" name="rank" required placeholder="과장"
                      value={formData.rank} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">직책</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="text" name="jobTitle" required placeholder="구매담당"
                      value={formData.jobTitle} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">회사 연락처</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      type="tel" name="companyPhone" required placeholder="02-0000-0000"
                      value={formData.companyPhone} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 group mt-4"
            >
              <span>회원가입 신청하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
