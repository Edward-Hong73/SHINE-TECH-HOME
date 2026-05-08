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
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | '롤러' | '클린싱'>('all');
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const isAdmin = user?.role === 'admin' || user?.company === '샤인테크' || user?.businessNumber === '108-12-67235';

    if (!isLoggedIn || !isAdmin) {
      alert('관리자 권한이 없습니다.');
      navigate('/');
    } else {
      fetchOrders();
    }
  }, [isLoggedIn, user, isLoading, navigate]);

  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    const [rollerResult, cleansingResult] = await Promise.all([
      supabase.from('order_roller_shine').select('*').order('created_at', { ascending: false }),
      supabase.from('order_cleansing_shine').select('*').order('created_at', { ascending: false })
    ]);

    if (rollerResult.error || cleansingResult.error) {
      alert('주문 목록을 불러오는 중 오류가 발생했습니다.');
    } else {
      const rollerOrders = (rollerResult.data || []).map(o => ({ ...o, product_category: '롤러' }));
      const cleansingOrders = (cleansingResult.data || []).map(o => ({ ...o, product_category: '클린싱' }));
      const allOrders = [...rollerOrders, ...cleansingOrders].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(allOrders);
    }
    setIsOrdersLoading(false);
  };

  const updateStatus = async (orderId: number, newStatus: string, category: string) => {
    const tableName = category === '롤러' ? 'order_roller_shine' : 'order_cleansing_shine';
    const { error } = await supabase.from(tableName).update({ status: newStatus }).eq('id', orderId);

    if (error) {
      alert('상태 업데이트 중 오류가 발생했습니다.');
    } else {
      setOrders(prev => prev.map(o => o.id === orderId && o.product_category === category ? { ...o, status: newStatus } : o));
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch =
        order.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toString().includes(searchQuery);
      const matchesCategory = filterCategory === 'all' || order.product_category === filterCategory;
      const matchesCompleted = hideCompleted ? order.status !== '출하 완료' : true;
      return matchesSearch && matchesCategory && matchesCompleted;
    })
    .sort((a, b) => {
      const aCompleted = a.status === '출하 완료' ? 1 : 0;
      const bCompleted = b.status === '출하 완료' ? 1 : 0;
      if (aCompleted !== bCompleted) return aCompleted - bCompleted;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: orders.length,
    roller: orders.filter(o => o.product_category === '롤러').length,
    cleansing: orders.filter(o => o.product_category === '클린싱').length
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-brand-600 p-2 rounded-xl">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">통합 주문 관제</h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">샤인테크의 모든 공급 품목(롤러/클린싱)을 통합 관리합니다.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            {[
              { id: 'all', label: '전체', count: stats.total, color: 'bg-slate-900' },
              { id: '롤러', label: '롤러', count: stats.roller, color: 'bg-blue-600' },
              { id: '클린싱', label: '클린싱', count: stats.cleansing, color: 'bg-pink-600' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  filterCategory === cat.id 
                    ? `${cat.color} text-white shadow-lg`
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <span>{cat.label}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-md text-[10px]",
                  filterCategory === cat.id ? "bg-white/20" : "bg-slate-100 text-slate-400"
                )}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex flex-1 items-center space-x-3 flex-wrap gap-y-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="업체명, 주문자, ID 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-brand-500/20 outline-none shadow-sm"
              />
            </div>
            <button
              onClick={fetchOrders}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
              title="새로고침"
            >
              <RefreshCw className={cn("w-5 h-5 text-slate-500", isOrdersLoading && "animate-spin")} />
            </button>
            <button
              onClick={() => setHideCompleted(prev => !prev)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-all shadow-sm",
                hideCompleted
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "w-8 h-4 rounded-full relative transition-colors",
                hideCompleted ? "bg-white/30" : "bg-slate-200"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all",
                  hideCompleted ? "left-4" : "left-0.5"
                )} />
              </div>
              <span>출하완료 숨기기</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <span className="text-xs font-bold text-slate-700">{user?.name} 관리자</span>
                <Settings className="w-4 h-4 text-slate-400" />
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
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">관리 시스템 정보</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-slate-600">
                          <User className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{user?.name}</span>
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

        {/* Orders Table */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">주문 날짜</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">주문 업체</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">제품 규격</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">가공/타입</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">수량/포장</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right uppercase">진행 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isOrdersLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-12 h-16 bg-slate-50/10">
                         <div className="h-4 bg-slate-100 rounded-full w-3/4 mx-auto"></div>
                      </td>
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
                    <tr
                      key={`${order.product_category}-${order.id}`}
                      className={cn(
                        "hover:bg-slate-50/80 transition-colors group",
                        order.status === '출하 완료' && "opacity-40"
                      )}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-600">
                            {`${new Date(order.created_at).getMonth() + 1}.${new Date(order.created_at).getDate()}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{order.company_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          {order.product_category === '클린싱' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-pink-100 text-pink-600 bg-pink-50 self-start mb-1.5">
                              클린싱
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-sm self-start">
                            {order.product_category === '롤러' 
                              ? `${order.outer_diameter}*${order.inner_diameter}*${order.sponge_length}*${order.total_length}`
                              : order.type === '원형' ? `${order.diameter}*${order.thickness}` : `${order.width}*${order.height}*${order.thickness}`
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col space-y-1">
                          {order.product_category === '롤러' ? (
                            <>
                              <div className="flex items-center space-x-1">
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/50">홀:{order.hole_processing || '없음'}</span>
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50">컷팅:{order.cutting_type || '없음'}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium">{order.type || '미지정'}</span>
                            </>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100/50">색상:{order.color}</span>
                              <span className="text-[9px] font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100/50">형태:{order.type}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-bold text-brand-600">{order.quantity}EA</span>
                          {order.individual_packaging && (
                            <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-md mt-1 border border-pink-100">개별포장</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <select 
                          value={order.status || '주문 요청'}
                          onChange={(e) => updateStatus(order.id, e.target.value, order.product_category)}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand-500/20 outline-none cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
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
