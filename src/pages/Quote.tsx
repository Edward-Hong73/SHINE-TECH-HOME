import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut,
  History, 
  Package, 
  Droplets, 
  ShoppingCart, 
  ClipboardCheck, 
  RefreshCw, 
  Search,
  Bell,
  User,
  ChevronDown,
  LayoutDashboard,
  Layers,
  Heart,
  Zap,
  Edit2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function Quote() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [companyCategory, setCompanyCategory] = useState<'롤러' | '클린싱'>('롤러');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [industrialSettings, setIndustrialSettings] = useState({
    outerDiameter: '120',
    innerDiameter: '32',
    totalLength: '600',
    spongeLength: '500',
    quantity: '1',
    individualPackaging: true
  });

  const [cosmeticSettings, setCosmeticSettings] = useState({
    type: '원형',
    color: '핑크',
    customColor: '',
    quantity: '500',
    diameter: '83',
    width: '110',
    height: '90',
    thickness: '10'
  });

  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === pastOrders.length && pastOrders.length > 0) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(pastOrders.map(o => o.id));
    }
  };

  const handleReorder = () => {
    if (selectedOrders.length === 0) {
      alert('재주문할 내역을 먼저 선택해주세요.');
      return;
    }
    
    const orderToReorder = pastOrders.find(o => o.id === selectedOrders[0]);
    if (orderToReorder && orderToReorder.raw) {
      const { raw } = orderToReorder;
      setEditingOrderId(null); // Reorder is always a NEW order
      if (orderToReorder.category === '롤러') {
        setIndustrialSettings({
          outerDiameter: raw.outer_diameter?.toString() || '',
          innerDiameter: raw.inner_diameter?.toString() || '',
          totalLength: raw.total_length?.toString() || '600',
          spongeLength: raw.sponge_length?.toString() || '500',
          quantity: raw.quantity?.toString() || '1',
          individualPackaging: raw.individual_packaging ?? true
        });
      } else {
        setCosmeticSettings({
          type: raw.type || '원형',
          color: raw.color || '핑크',
          customColor: raw.custom_color || '',
          quantity: raw.quantity?.toString() || '500',
          diameter: raw.diameter?.toString() || '83',
          width: raw.width?.toString() || '110',
          height: raw.height?.toString() || '90',
          thickness: raw.thickness?.toString() || '10'
        });
      }
      alert('선택한 주문의 규격이 주문서에 입력되었습니다. [주문하기]를 누르면 새 주문으로 접수됩니다.');
    }
  };

  const handleEdit = (order: any) => {
    if (order && order.raw) {
      const { raw } = order;
      setEditingOrderId(raw.id); // Store the ID for updating
      if (order.category === '롤러') {
        setIndustrialSettings({
          outerDiameter: raw.outer_diameter?.toString() || '',
          innerDiameter: raw.inner_diameter?.toString() || '',
          totalLength: raw.total_length?.toString() || '600',
          spongeLength: raw.sponge_length?.toString() || '500',
          quantity: raw.quantity?.toString() || '1',
          individualPackaging: raw.individual_packaging ?? true
        });
      } else {
        setCosmeticSettings({
          type: raw.type || '원형',
          color: raw.color || '핑크',
          customColor: raw.custom_color || '',
          quantity: raw.quantity?.toString() || '500',
          diameter: raw.diameter?.toString() || '83',
          width: raw.width?.toString() || '110',
          height: raw.height?.toString() || '90',
          thickness: raw.thickness?.toString() || '10'
        });
      }
      alert('주문 내역을 수정 모드로 불러왔습니다. 수정 후 [주문하기]를 누르면 기존 내역이 업데이트됩니다.');
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  useEffect(() => {
    fetchPastOrders(user?.businessNumber || 'DEMO');
  }, [user]);

  const fetchCompanyInfo = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('companies_shine')
      .select('main_category')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data && data.main_category) {
      setCompanyCategory(data.main_category as any);
    }
    
    setIsLoading(false);
  };

  const fetchPastOrders = async (bizNum: string) => {
    if (bizNum === 'DEMO') {
      setPastOrders([
        {
          id: 'ORD-C-00001',
          type: '미용 클린싱 (원형)',
          status: '배송 완료',
          summary: '83*10 (수량: 500EA)',
          date: '2024.03.15',
          created_at: '2024-03-15T10:00:00',
          category: '클린싱',
          raw: { type: '원형', diameter: 83, thickness: 10, quantity: 500, color: '핑크' }
        },
        {
          id: 'ORD-R-00001',
          type: '산업용 롤러',
          status: '주문 승인',
          summary: '150*32*400*500 (수량: 5EA)',
          date: '2024.03.10',
          created_at: '2024-03-10T14:30:00',
          category: '롤러',
          raw: { outer_diameter: 150, inner_diameter: 32, sponge_length: 400, total_length: 500, quantity: 5 }
        }
      ]);
      return;
    }

    const [rollerResult, cleansingResult] = await Promise.all([
      supabase.from('order_roller_shine').select('*').eq('business_number', bizNum),
      supabase.from('order_cleansing_shine').select('*').eq('business_number', bizNum)
    ]);

    if (rollerResult.error || cleansingResult.error) {
      const error = rollerResult.error || cleansingResult.error;
      console.error('Fetch error:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다: ' + error?.message);
      return;
    }

    const rollerOrders = (rollerResult.data || []).map(order => ({
      id: `ORD-R-${order.id.toString().padStart(5, '0')}`,
      type: '산업용 롤러',
      status: order.status || '주문 요청',
      summary: `${order.outer_diameter}*${order.inner_diameter}*${order.sponge_length}*${order.total_length} (수량: ${order.quantity}EA)`,
      date: new Date(order.created_at).toLocaleDateString(),
      created_at: order.created_at,
      raw: order,
      category: '롤러'
    }));

    const cleansingOrders = (cleansingResult.data || []).map(order => {
      let summaryText = '';
      if (order.type === '원형') {
        summaryText = `${order.diameter}*${order.thickness} (수량: ${order.quantity}EA)`;
      } else {
        summaryText = `${order.width}*${order.height}*${order.thickness} (수량: ${order.quantity}EA)`;
      }

      return {
        id: `ORD-C-${order.id.toString().padStart(5, '0')}`,
        type: `미용 클린싱 (${order.type})`,
        status: order.status || '주문 요청',
        summary: summaryText,
        date: new Date(order.created_at).toLocaleDateString(),
        created_at: order.created_at,
        raw: order,
        category: '클린싱'
      };
    });

    const allOrders = [...rollerOrders, ...cleansingOrders].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (allOrders.length === 0) {
      // Show mock data if DB is empty for this company
      setPastOrders([
        {
          id: 'ORD-C-SAMPLE',
          type: '미용 클린싱 (원형)',
          status: '샘플 데이터',
          summary: '83*10 (수량: 100EA)',
          date: new Date().toLocaleDateString(),
          created_at: new Date().toISOString(),
          category: '클린싱',
          raw: { type: '원형', diameter: 83, thickness: 10, quantity: 100, color: '블루' }
        }
      ]);
    } else {
      setPastOrders(allOrders);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      {/* Aggressive Debug Header */}
      <div className={cn(
        "fixed top-16 left-0 right-0 z-[100] text-white text-xs px-4 py-2 flex justify-between items-center shadow-lg",
        user?.businessNumber ? "bg-slate-900" : "bg-red-600 animate-pulse"
      )}>
        <div className="flex items-center space-x-4">
          <span className="font-bold">시스템 상태:</span>
          <span>사용자: <b>{user?.name || '익명'}</b></span>
          <span>사업자번호: <b>{user?.businessNumber || '정보 없음 (재로그인 필요)'}</b></span>
        </div>
        <div className="text-[10px] opacity-70">
          Quote.tsx v2.0 - {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Header / Sub-Nav */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 mr-4 group text-slate-900 font-bold">
              <button 
                onClick={() => {
                  if (confirm('로그아웃 하시겠습니까?')) {
                    navigate('/login');
                  }
                }}
                className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200/50"
                title="로그아웃"
              >
                <LogOut className="text-white w-4 h-4" />
              </button>
              <span className="text-lg tracking-tighter">
                SHINE<span className="text-brand-500 underline underline-offset-4 decoration-2">TECH</span>
              </span>
              <div className="ml-4 px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-bold rounded border border-brand-100 flex items-center">
                {isLoading ? '연결 중..' : `${companyCategory} 파트너`}
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              {[
                { name: '대시보드', icon: LayoutDashboard, active: false },
                { name: '주문', icon: ShoppingCart, active: true },
                { name: '인벤토리', icon: Layers, active: false },
                { name: '고객지원', icon: Heart, active: false }
              ].map((item) => (
                <button 
                  key={item.name} 
                  className={cn(
                    "flex items-center space-x-2 text-sm font-semibold transition-colors py-2 border-b-2",
                    item.active ? "text-brand-600 border-brand-600" : "text-slate-500 border-transparent hover:text-slate-800"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center border border-amber-200">
               <User className="text-amber-600 w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-900 leading-none">{user?.name || '익명'}</span>
              <span className="text-[9px] text-slate-400 font-medium">프리미엄 파트너</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Vertical Stack (Setup above History) */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-8">
          {/* Top: Category-based Order Form */}
          <div className="w-full">
            {isLoading ? (
              <div className="bg-white rounded-3xl p-12 shadow-md border border-slate-100 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-sm text-slate-400 font-bold">정보를 불러오는 중...</p>
              </div>
            ) : companyCategory === '롤러' ? (
              /* Industrial Roller Form */
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-md border border-slate-100"
              >
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="text-blue-600 w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 tracking-tight">PVA 스폰지 롤러 설정</h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  {[
                    { label: "스폰지 외경 (MM)", value: industrialSettings.outerDiameter, key: "outerDiameter" },
                    { label: "내경 (mm)", value: industrialSettings.innerDiameter, key: "innerDiameter" },
                    { label: "스폰지 길이 (MM)", value: industrialSettings.spongeLength, key: "spongeLength" },
                    { label: "전체 길이 (MM)", value: industrialSettings.totalLength, key: "totalLength" },
                    { label: "수량", value: industrialSettings.quantity, key: "quantity" },
                  ].map((input) => (
                    <div key={input.key} className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">{input.label}</label>
                      <input 
                        type="text" 
                        value={input.value}
                        onChange={(e) => setIndustrialSettings({...industrialSettings, [input.key]: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                  <span className="text-xs font-bold text-slate-600">개별 포장 여부</span>
                  <button 
                    onClick={() => setIndustrialSettings({...industrialSettings, individualPackaging: !industrialSettings.individualPackaging})}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative",
                      industrialSettings.individualPackaging ? "bg-brand-600" : "bg-slate-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      industrialSettings.individualPackaging ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => alert('견적 문의가 성공적으로 접수되었습니다. 담당 매니저가 연락드리겠습니다.')}
                    className="py-4 bg-white border-2 border-brand-600 text-brand-600 font-bold rounded-2xl hover:bg-brand-50 transition-all text-sm"
                  >
                    견적 문의
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 group text-sm"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>주문하기</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Cosmetic Sponge Form */
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-md border border-slate-100"
              >
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center shrink-0">
                    <Droplets className="text-pink-600 w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 tracking-tight">미용 클린싱 주문 설정</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">스폰지 형태</label>
                      <div className="flex space-x-2">
                        {['원형', '사각원형'].map((type) => (
                          <button 
                            key={type}
                            onClick={() => {
                              const defaults = type === '원형' 
                                ? { diameter: '83', thickness: '10' } 
                                : { width: '110', height: '90', thickness: '12' };
                              setCosmeticSettings({...cosmeticSettings, type, ...defaults});
                            }}
                            className={cn(
                              "flex-1 py-2 text-xs font-bold rounded-lg border transition-all",
                              cosmeticSettings.type === type ? "bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-200" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Size Inputs */}
                    <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                      {cosmeticSettings.type === '원형' ? (
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">지름(mm)</label>
                          <input 
                            type="text" 
                            placeholder="예: 83"
                            value={cosmeticSettings.diameter}
                            onChange={(e) => setCosmeticSettings({...cosmeticSettings, diameter: e.target.value})}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm font-semibold"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">가로(mm)</label>
                            <input 
                              type="text" 
                              placeholder="예: 110"
                              value={cosmeticSettings.width}
                              onChange={(e) => setCosmeticSettings({...cosmeticSettings, width: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm font-semibold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">세로(mm)</label>
                            <input 
                              type="text" 
                              placeholder="예: 90"
                              value={cosmeticSettings.height}
                              onChange={(e) => setCosmeticSettings({...cosmeticSettings, height: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm font-semibold"
                            />
                          </div>
                        </>
                      )}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">두께(mm)</label>
                        <input 
                          type="text" 
                          placeholder="예: 10"
                          value={cosmeticSettings.thickness}
                          onChange={(e) => setCosmeticSettings({...cosmeticSettings, thickness: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">색상 테마</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <select 
                            value={cosmeticSettings.color}
                            onChange={(e) => setCosmeticSettings({...cosmeticSettings, color: e.target.value})}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm font-semibold appearance-none cursor-pointer"
                          >
                            <option>핑크</option>
                            <option>블루</option>
                            <option>백색</option>
                            <option>직접 입력</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        {cosmeticSettings.color === '직접 입력' && (
                          <input 
                            type="text" 
                            placeholder="색상 직접 입력"
                            value={cosmeticSettings.customColor}
                            onChange={(e) => setCosmeticSettings({...cosmeticSettings, customColor: e.target.value})}
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm font-semibold"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">희망 주문 수량</label>
                      <input 
                        type="text" 
                        value={cosmeticSettings.quantity}
                        onChange={(e) => setCosmeticSettings({...cosmeticSettings, quantity: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button 
                    onClick={() => alert('견적 문의가 접수되었습니다. 담당자가 연락드리겠습니다.')}
                    className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm"
                  >
                    견적 문의
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="py-4 bg-pink-600 text-white font-bold rounded-2xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 group text-sm"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>주문하기</span>
                  </button>
                </div>
              </motion.div>
            )}

          </div>


          {/* Bottom: Past Orders */}
          <div className="w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <History className="text-slate-500 w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">최근 주문 내역</h3>
                </div>
                <button 
                  onClick={handleReorder}
                  className="flex items-center space-x-2 text-sm font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>재주문 하기</span>
                </button>
              </div>

              <div className="px-0 py-0">
                {pastOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="pl-8 pr-4 py-4 w-10">
                            <input 
                              type="checkbox" 
                              checked={selectedOrders.length === pastOrders.length && pastOrders.length > 0}
                              onChange={handleSelectAll}
                              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                            />
                          </th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">주문 번호</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">카테고리</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">상세 내역</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">주문 일자</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {pastOrders.map((order) => (
                          <tr key={order.id} className={cn(
                            "hover:bg-slate-50/80 transition-colors group",
                            selectedOrders.includes(order.id) && "bg-brand-50/30"
                          )}>
                            <td className="pl-8 pr-4 py-5">
                              <input 
                                type="checkbox" 
                                checked={selectedOrders.includes(order.id)}
                                onChange={() => toggleSelect(order.id)}
                                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-sm font-bold text-slate-900">{order.id}</span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center space-x-2">
                                <span className={cn(
                                  "w-2 h-2 rounded-full",
                                  order.category === '롤러' ? "bg-blue-500" : "bg-pink-500"
                                )} />
                                <span className="text-sm font-semibold text-slate-700">{order.type}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-sm text-slate-600 line-clamp-1">{order.summary}</span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className="text-xs font-bold text-slate-400">{order.date}</span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button 
                                onClick={() => handleEdit(order)}
                                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                                title="주문 수정"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                      <History className="w-12 h-12 text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">과거 주문 내역이 없습니다..</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Support Card */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-brand-200 mt-8">
              <div className="relative z-10 max-w-md">
                <h4 className="text-xl font-bold mb-3">전담 매니저 매칭 완료</h4>
                <p className="text-brand-100 text-sm leading-relaxed mb-6">
                  {companyCategory === '롤러' 
                    ? '산업용 대량 주문 및 특수 규격 제작은 기술팀과 직접 상담이 가능합니다.' 
                    : '미용 스폰지 ODM 제작 및 패키지 디자인 상담이 준비되어 있습니다.'}
                </p>
                <div className="flex space-x-4">
                  <button className="bg-white text-brand-600 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-50 transition-all">
                    자세히 보기
                  </button>
                  <button className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-white/30 transition-all">
                    1:1 채팅 문의
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ClipboardCheck className="w-48 h-48" />
              </div>
            </div>
          </div>

          {/* Promo Banner at Bottom */}
          <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100/50 flex space-x-4">
            <div className="w-10 h-10 bg-brand-200/50 rounded-full flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-brand-700 font-bold" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-brand-900 mb-1">대량 주문 혜택</h5>
              <p className="text-[11px] text-brand-700 leading-relaxed font-medium">
                5,000개 이상의 주문은 맞춤형 균일가 할인이 가능합니다. 자세한 내용은 담당 매니저에게 문의하세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                    <ClipboardCheck className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">최종 주문 확인</h3>
                    <p className="text-xs text-slate-500">파트너사 전용 견적을 확인해주세요.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  {companyCategory === '롤러' ? (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <h4 className="text-xs font-bold text-blue-600 uppercase mb-4 flex items-center">
                        <Package className="w-3.5 h-3.5 mr-2" />
                        PVA 스폰지 롤러 설정 요약
                      </h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">외경:</span><span className="font-bold text-slate-800">{industrialSettings.outerDiameter}mm</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">내경:</span><span className="font-bold text-slate-800">{industrialSettings.innerDiameter}mm</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">스폰지 길이:</span><span className="font-bold text-slate-800">{industrialSettings.spongeLength}mm</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">전체 길이:</span><span className="font-bold text-slate-800">{industrialSettings.totalLength}mm</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">총 수량:</span><span className="font-bold text-brand-600">{industrialSettings.quantity}EA</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">개별 포장:</span><span className="font-bold text-slate-800">{industrialSettings.individualPackaging ? '예' : '아니오'}</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-pink-50/30 rounded-2xl p-5 border border-pink-100/50">
                      <h4 className="text-xs font-bold text-pink-600 uppercase mb-4 flex items-center">
                        <Droplets className="w-3.5 h-3.5 mr-2" />
                        미용 클린싱 전용 사양 요약
                      </h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">유형:</span><span className="font-bold text-slate-800">{cosmeticSettings.type}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">색상:</span><span className="font-bold text-slate-800">{cosmeticSettings.color === '직접 입력' ? cosmeticSettings.customColor : cosmeticSettings.color}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">두께:</span><span className="font-bold text-slate-800">{cosmeticSettings.thickness}mm</span></div>
                        {cosmeticSettings.type === '원형' ? (
                          <div className="flex justify-between text-sm"><span className="text-slate-500">지름:</span><span className="font-bold text-slate-800">{cosmeticSettings.diameter}mm</span></div>
                        ) : (
                          <>
                            <div className="flex justify-between text-sm"><span className="text-slate-500">가로:</span><span className="font-bold text-slate-800">{cosmeticSettings.width}mm</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-500">세로:</span><span className="font-bold text-slate-800">{cosmeticSettings.height}mm</span></div>
                          </>
                        )}
                        <div className="flex justify-between text-sm col-span-2 border-t border-pink-100 pt-2 mt-1"><span className="text-slate-500">요청 총 수량:</span><span className="font-bold text-pink-600 text-base">{cosmeticSettings.quantity}EA</span></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm"
                  >
                    규격 수정하기
                  </button>
                  <button 
                    onClick={async () => {
                      if (companyCategory === '롤러') {
                        const orderData = {
                          outer_diameter: industrialSettings.outerDiameter,
                          inner_diameter: industrialSettings.innerDiameter,
                          total_length: industrialSettings.totalLength,
                          sponge_length: industrialSettings.spongeLength,
                          quantity: industrialSettings.quantity,
                          individual_packaging: industrialSettings.individualPackaging,
                          company_name: user?.company || '정보 없음',
                          business_number: user?.businessNumber || '',
                          orderer_name: user?.name || '',
                          ...(editingOrderId ? {} : { status: '주문 요청' })
                        };

                        let error;
                        if (editingOrderId) {
                          const { error: updateError } = await supabase
                            .from('order_roller_shine')
                            .update(orderData)
                            .eq('id', editingOrderId);
                          error = updateError;
                        } else {
                          const { error: insertError } = await supabase
                            .from('order_roller_shine')
                            .insert([orderData]);
                          error = insertError;
                        }

                        if (error) {
                          alert('주문 처리 중 오류가 발생했습니다: ' + error.message);
                          return;
                        }
                        
                        if (user?.businessNumber) {
                          fetchPastOrders(user.businessNumber);
                        }

                        alert(editingOrderId ? '주문이 성공적으로 수정되었습니다.' : '주문이 성공적으로 접수되었습니다. 담당 매니저가 곧 연락드리겠습니다.');
                        setEditingOrderId(null);
                        setIsModalOpen(false);
                      } else {
                        const cleansingData = {
                          type: cosmeticSettings.type,
                          diameter: cosmeticSettings.diameter,
                          width: cosmeticSettings.width,
                          height: cosmeticSettings.height,
                          thickness: cosmeticSettings.thickness,
                          color: cosmeticSettings.color === '직접 입력' ? cosmeticSettings.customColor : cosmeticSettings.color,
                          quantity: cosmeticSettings.quantity,
                          company_name: user?.company || '정보 없음',
                          business_number: user?.businessNumber || '',
                          orderer_name: user?.name || '',
                          status: '주문 요청'
                        };

                        const { error: insertError } = await supabase
                          .from('order_cleansing_shine')
                          .insert([cleansingData]);
                        
                        if (insertError) {
                          alert('주문 처리 중 오류가 발생했습니다: ' + insertError.message);
                          return;
                        }
                        
                        if (user?.businessNumber) {
                          fetchPastOrders(user.businessNumber);
                        }

                        alert('주문이 성공적으로 접수되었습니다. 담당 매니저가 곧 연락드리겠습니다.');
                        setIsModalOpen(false);
                      }
                    }}
                    className={cn(
                      "flex-1 py-4 text-white font-bold rounded-2xl transition-all shadow-lg text-sm",
                      companyCategory === '롤러' ? "bg-brand-600 hover:bg-brand-700 shadow-brand-500/20" : "bg-pink-600 hover:bg-pink-700 shadow-pink-500/20"
                    )}
                  >
                    {editingOrderId ? '변경 내용 저장' : '최종 주문하기'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}