import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { 
  ClipboardList, 
  Settings, 
  Package, 
  Truck, 
  CheckCircle, 
  Search,
  Filter,
  RefreshCw,
  Zap,
  LogOut,
  User,
  Mail,
  Building2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const STATUS_STEPS = ['주문 요청', '주문접수', '생산', '후처리', '출하 대기', '출하 완료'];

export default function Admin() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // 1. 유저 정보가 아직 로딩 중이면 기다립니다.
    if (isLoggedIn && !user) return;

    // 2. 관리자 권한 확인 (회사 이름 또는 대표님 사업자 번호)
    const isAdmin = user?.company === '샤인테크' || user?.businessNumber === '108-12-67235';

    if (!isLoggedIn || !isAdmin) {
      alert('관리자 권한이 없습니다. 샤인테크 직원만 접근 가능합니다.');
      navigate('/');
    } else {
      fetchOrders();
    }
  }, [isLoggedIn, user, navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('order_roller_shine')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      alert('주문 목록을 불러오는 중 오류가 발생했습니다.');
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase
      .from('order_roller_shine')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('상태 업데이트 중 오류가 발생했습니다. (DB에 status 컬럼이 있는지 확인이 필요합니다)');
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const filteredOrders = orders.filter(order => 
    order.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.business_number?.includes(searchQuery) ||
    order.id.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
              <ClipboardList className="w-8 h-8 mr-3 text-brand-600" />
              주문 관제 대시보드 (관리자)
            </h1>
            <p className="text-slate-500 mt-1 text-sm">전체 파트너사의 주문 현황 및 공정 단계를 관리합니다.</p>
          </div>
          
          <div className="flex items-center space-x-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="업체명, 주문자, ID 검색..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 outline-none w-64"
               />
             </div>
             <button 
               onClick={fetchOrders}
               className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
               title="새로고침"
             >
               <RefreshCw className={cn("w-4 h-4 text-slate-500", isLoading && "animate-spin")} />
             </button>
             <div className="relative">
               <button 
                 onClick={() => setIsProfileOpen(!isProfileOpen)}
                 className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                 title="관리자 설정"
               >
                 <Settings className="w-4 h-4 text-slate-500" />
               </button>

               <AnimatePresence>
                 {isProfileOpen && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] text-left"
                   >
                     <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">관리자 세션</p>
                       <div className="space-y-2">
                         <div className="flex items-center space-x-2 text-slate-600">
                           <User className="w-3.5 h-3.5" />
                           <span className="text-xs font-bold">{user?.name} (관리자)</span>
                         </div>
                         <div className="flex items-center space-x-2 text-slate-500">
                           <Mail className="w-3.5 h-3.5" />
                           <span className="text-[11px] truncate whitespace-nowrap overflow-hidden">{user?.email}</span>
                         </div>
                         <div className="flex items-center space-x-2 text-slate-500">
                           <Building2 className="w-3.5 h-3.5" />
                           <span className="text-[11px]">{user?.company}</span>
                         </div>
                       </div>
                     </div>
                     <div className="p-1">
                       <button 
                         onClick={() => {
                           if (confirm('관리자 세션을 종료하시겠습니까?')) {
                             logout();
                             navigate('/');
                           }
                         }}
                         className="flex items-center space-x-2 w-full px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                       >
                         <LogOut className="w-3.5 h-3.5" />
                         <span>관리 시스템 로그아웃</span>
                       </button>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           </div>
         </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">주문 ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">파트너사 / 주문자</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">제품 규격</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">수량</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">현재 공정</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">상태 변경</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8 h-16 bg-slate-50/10"></td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                      검색 조건에 맞는 주문 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-400">#ORD-{order.id.toString().padStart(5, '0')}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{order.company_name}</span>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                              {order.business_number || '-'}
                            </span>
                            <span className="text-[10px] text-slate-300">|</span>
                            <span className="text-[10px] text-slate-500 font-medium">{order.orderer_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {order.outer_diameter}*{order.inner_diameter}*{order.sponge_length}*{order.total_length}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-brand-600">{order.quantity}EA</span>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={order.status || '주문 요청'} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <select 
                          value={order.status || '주문 요청'}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand-500/20 outline-none cursor-pointer hover:border-slate-300 transition-colors"
                        >
                          {STATUS_STEPS.map(step => (
                            <option key={step} value={step}>{step}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    '주문 요청': "bg-sky-50 text-sky-600 border-sky-100",
    '주문접수': "bg-blue-50 text-blue-600 border-blue-100",
    '생산': "bg-amber-50 text-amber-600 border-amber-100",
    '후처리': "bg-purple-50 text-purple-600 border-purple-100",
    '출하 대기': "bg-indigo-50 text-indigo-600 border-indigo-100",
    '출하 완료': "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  const icons: Record<string, any> = {
    '주문 요청': Zap,
    '주문접수': ClipboardList,
    '생산': Settings,
    '후처리': RefreshCw,
    '출하 대기': Package,
    '출하 완료': Truck,
  };

  const Icon = icons[status] || ClipboardList;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border",
      styles[status] || "bg-slate-50 text-slate-600 border-slate-100"
    )}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
}
