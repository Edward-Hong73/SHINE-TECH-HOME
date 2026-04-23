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
  const { user, isLoggedIn, isLoading } = useAuth();
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);
  const [companyCategory, setCompanyCategory] = useState<'롤러' | '클린싱'>('롤러');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = () => {
    if (isLoggedIn) {
      setIsModalOpen(true);
    } else {
      alert('주문 기능은 회원만 이용 가능합니다. 로그인해 주세요!');
      navigate('/login');
    }
  };

  
  const [industrialSettings, setIndustrialSettings] = useState({
    outerDiameter: '32',
    customOuterDiameter: '',
    innerDiameter: '16',
    customInnerDiameter: '',
    holeProcessing: '홀가공 없음',
    customHoleProcessing: '',
    type: '파이프 타입',
    totalLength: '600',
    spongeLength: '500',
    quantity: '1',
    individualPackaging: false,
    cuttingType: '없음'
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
        const outerOptions = ['20','25','30','32','35','40','45','50','55','60','65','77','83','100'];
        const innerOptions = ['6','8','10','13','16','20','25','40'];
        const holeOptions = ['홀가공 없음','4','5','6','7','8','9','10'];
        
        const outerVal = raw.outer_diameter?.toString() || '';
        const innerVal = raw.inner_diameter?.toString() || '';
        const holeVal = raw.hole_processing?.toString() || '홀가공 없음';

        setIndustrialSettings({
          outerDiameter: outerOptions.includes(outerVal) ? outerVal : '직접입력',
          customOuterDiameter: outerOptions.includes(outerVal) ? '' : outerVal,
          innerDiameter: innerOptions.includes(innerVal) ? innerVal : '직접 입력',
          customInnerDiameter: innerOptions.includes(innerVal) ? '' : innerVal,
          holeProcessing: holeOptions.includes(holeVal) ? holeVal : '직접 입력',
          customHoleProcessing: holeOptions.includes(holeVal) ? '' : holeVal,
          type: raw.type || '파이프 타입',
          totalLength: raw.total_length?.toString() || '600',
          spongeLength: raw.sponge_length?.toString() || '500',
          quantity: raw.quantity?.toString() || '1',
          individualPackaging: raw.individual_packaging ?? false,
          cuttingType: raw.cutting_type || '없음'
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
        const outerOptions = ['20','25','30','32','35','40','45','50','55','60','65','77','83','100'];
        const innerOptions = ['6','8','10','13','16','20','25','40'];
        const holeOptions = ['홀가공 없음','4','5','6','7','8','9','10'];
        
        const outerVal = raw.outer_diameter?.toString() || '';
        const innerVal = raw.inner_diameter?.toString() || '';
        const holeVal = raw.hole_processing?.toString() || '홀가공 없음';

        setIndustrialSettings({
          outerDiameter: outerOptions.includes(outerVal) ? outerVal : '직접입력',
          customOuterDiameter: outerOptions.includes(outerVal) ? '' : outerVal,
          innerDiameter: innerOptions.includes(innerVal) ? innerVal : '직접 입력',
          customInnerDiameter: innerOptions.includes(innerVal) ? '' : innerVal,
          holeProcessing: holeOptions.includes(holeVal) ? holeVal : '직접 입력',
          customHoleProcessing: holeOptions.includes(holeVal) ? '' : holeVal,
          type: raw.type || '파이프 타입',
          totalLength: raw.total_length?.toString() || '600',
          spongeLength: raw.sponge_length?.toString() || '500',
          quantity: raw.quantity?.toString() || '1',
          individualPackaging: raw.individual_packaging ?? false,
          cuttingType: raw.cutting_type || '없음'
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
    if (user?.businessNumber) {
      fetchCompanyInfo(user.businessNumber);
    }
  }, [user]);

  useEffect(() => {
    fetchPastOrders(user?.businessNumber || 'DEMO');
  }, [user]);

  const fetchCompanyInfo = async (bizNum: string) => {
    if (!bizNum || bizNum === 'DEMO') return;
    
    setIsCompanyLoading(true);
    const { data, error } = await supabase
      .from('companies_shine')
      .select('main_category')
      .eq('business_number', bizNum)
      .maybeSingle();

    if (data && data.main_category) {
      setCompanyCategory(data.main_category as any);
    }
    
    setIsCompanyLoading(false);
  };

  const fetchPastOrders = async (bizNum: string) => {
    // 공백 제거 및 유효성 검사 강화
    const cleanBizNum = bizNum?.trim();
    console.log('--- Fetching Orders Started ---');
    console.log('Original BizNum:', bizNum);
    console.log('Cleaned BizNum for Filter:', cleanBizNum);

    if (!cleanBizNum || cleanBizNum === 'undefined' || cleanBizNum === 'null' || cleanBizNum === '') {
      console.warn('Invalid business number provided for filtering');
      setPastOrders([]);
      return;
    }

    // [진단용] 모든 최근 주문 5건을 가져와서 사업자 번호 형식 확인
    const { data: debugData } = await supabase.from('order_roller_shine').select('business_number').limit(5).order('created_at', { ascending: false });
    console.log('--- DB Diagnostic Log (Recent 5 Orders) ---');
    debugData?.forEach((d, i) => console.log(`Order ${i+1} BizNum in DB: "${d.business_number}"`));

    const [rollerResult, cleansingResult] = await Promise.all([
      supabase.from('order_roller_shine')
        .select('*')
        .or(`business_number.eq.${cleanBizNum},business_number.eq.${cleanBizNum.replace(/-/g, '')},business_number.ilike.%${cleanBizNum.replace(/-/g, '')}%`),
      supabase.from('order_cleansing_shine')
        .select('*')
        .or(`business_number.eq.${cleanBizNum},business_number.eq.${cleanBizNum.replace(/-/g, '')},business_number.ilike.%${cleanBizNum.replace(/-/g, '')}%`)
    ]);

    console.log('Search Condition:', `business_number.eq.${cleanBizNum},business_number.eq.${cleanBizNum.replace(/-/g, '')}, ilike pattern`);
    console.log('Roller Result Count:', rollerResult.data?.length || 0);
    console.log('Cleansing Result Count:', cleansingResult.data?.length || 0);

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
      summary: `${order.outer_diameter}*${order.inner_diameter}*${order.sponge_length}*${order.total_length} (컷팅:${order.cutting_type || '없음'}, 홀:${order.hole_processing || '없음'}, ${order.type}) (수량: ${order.quantity}EA)`,
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

    setPastOrders(allOrders);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      {/* Main Content Area: Vertical Stack (Setup above History) */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-8">
          {/* Top: Category-based Order Form */}
          <div className="w-full">
            {isCompanyLoading ? (
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
                <div className="space-y-8">
                  {/* 1st Row: Core Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Outer Diameter */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">스폰지 외경 (MM)</label>
                      <div className="flex flex-col gap-2">
                        <select 
                          value={industrialSettings.outerDiameter}
                          onChange={(e) => setIndustrialSettings({...industrialSettings, outerDiameter: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-semibold appearance-none cursor-pointer"
                        >
                          {['20','25','30','32','35','40','45','50','55','60','65','77','83','100','직접입력'].map(opt => (
                            <option key={opt} value={opt}>{opt}{opt !== '직접입력' ? ' mm' : ''}</option>
                          ))}
                        </select>
                        {industrialSettings.outerDiameter === '직접입력' && (
                          <input 
                            type="text" 
                            placeholder="외경직접입력"
                            value={industrialSettings.customOuterDiameter}
                            onChange={(e) => setIndustrialSettings({...industrialSettings, customOuterDiameter: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm font-semibold"
                          />
                        )}
                      </div>
                    </div>

                    {/* Inner Diameter */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">내경 (mm)</label>
                      <div className="flex flex-col gap-2">
                        <select 
                          value={industrialSettings.innerDiameter}
                          onChange={(e) => setIndustrialSettings({...industrialSettings, innerDiameter: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-semibold appearance-none cursor-pointer"
                        >
                          {['6','8','10','13','16','20','25','40','직접 입력'].map(opt => (
                            <option key={opt} value={opt}>{opt}{opt !== '직접 입력' ? ' mm' : ''}</option>
                          ))}
                        </select>
                        {industrialSettings.innerDiameter === '직접 입력' && (
                          <input 
                            type="text" 
                            placeholder="내경직접입력"
                            value={industrialSettings.customInnerDiameter}
                            onChange={(e) => setIndustrialSettings({...industrialSettings, customInnerDiameter: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm font-semibold"
                          />
                        )}
                      </div>
                    </div>

                    {/* Sponge Length */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">스폰지 길이 (MM)</label>
                      <input 
                        type="text" 
                        value={industrialSettings.spongeLength}
                        onChange={(e) => setIndustrialSettings({...industrialSettings, spongeLength: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-semibold"
                      />
                    </div>

                    {/* Total Length */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">전체 길이 (MM)</label>
                      <input 
                        type="text" 
                        value={industrialSettings.totalLength}
                        onChange={(e) => setIndustrialSettings({...industrialSettings, totalLength: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* 2nd Row: Options & Quantity */}
                  {/* Industrial Order Form - Row 2: Cutting Type, Hole, Type, Qty, Packaging */}
                  <div className="grid grid-cols-5 gap-4 border-t border-slate-50 pt-8">
                    {/* Cutting Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">스펀지 컷팅</label>
                      <select 
                        value={industrialSettings.cuttingType}
                        onChange={(e) => setIndustrialSettings({...industrialSettings, cuttingType: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      >
                        <option value="없음">없음</option>
                        <option value="한쪽">한쪽</option>
                        <option value="양쪽">양쪽</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">홀 가공 (파이)</label>
                      <div className="flex gap-2">
                        <select 
                          value={industrialSettings.holeProcessing}
                          onChange={(e) => setIndustrialSettings({...industrialSettings, holeProcessing: e.target.value, customHoleProcessing: e.target.value === '직접 입력' ? industrialSettings.customHoleProcessing : ''})}
                          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                        >
                          <option value="홀가공 없음">홀가공 없음</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="직접 입력">직접 입력</option>
                        </select>
                        {industrialSettings.holeProcessing === '직접 입력' && (
                          <input 
                            type="text"
                            placeholder="입력"
                            value={industrialSettings.customHoleProcessing}
                            onChange={(e) => setIndustrialSettings({...industrialSettings, customHoleProcessing: e.target.value})}
                            className="w-16 px-1 py-1 bg-white border border-brand-200 rounded-xl text-center text-sm font-bold text-brand-600 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">타입</label>
                      <select 
                        value={industrialSettings.type}
                        onChange={(e) => setIndustrialSettings({...industrialSettings, type: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      >
                        <option value="파이프 타입">파이프 타입</option>
                        <option value="튜브 타입">튜브 타입</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">수량 (EA)</label>
                      <input 
                        type="number"
                        min="1"
                        value={industrialSettings.quantity}
                        onChange={(e) => setIndustrialSettings({...industrialSettings, quantity: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      />
                    </div>

                    {/* Individual Packaging Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">개별 포장</label>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 h-[46px]">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">개별 포장</span>
                          <span className="text-[10px] text-slate-500">(포장 시 1,000원/개 추가)</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setIndustrialSettings({...industrialSettings, individualPackaging: !industrialSettings.individualPackaging})}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                            industrialSettings.individualPackaging ? "bg-brand-600" : "bg-slate-200"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                              industrialSettings.individualPackaging ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
                  <button 
                    onClick={() => alert('견적 문의가 성공적으로 접수되었습니다. 담당 매니저가 연락드리겠습니다.')}
                    className="py-4 bg-white border-2 border-brand-600 text-brand-600 font-bold rounded-2xl hover:bg-brand-50 transition-all text-sm"
                  >
                    견적 문의
                  </button>
                  <button 
                    onClick={handleOrderClick}
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
                    onClick={handleOrderClick}
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
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">규격 (外*內*L*TL)</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">홀/컷팅/타입</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">수량</th>
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
                                <span className="text-sm font-semibold text-slate-700">{order.type_display || order.type}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-sm text-slate-600 font-medium">
                                {order.category === '롤러' 
                                  ? `${order.raw.outer_diameter}*${order.raw.inner_diameter}*${order.raw.sponge_length}*${order.raw.total_length}`
                                  : order.summary.split(' (')[0]
                                }
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center whitespace-nowrap min-w-[200px]">
                              {order.category === '롤러' ? (
                                <div className="flex items-center justify-center space-x-1.5">
                                  <span className="inline-flex items-center text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/50">
                                    홀:{order.raw.hole_processing || '없음'}
                                  </span>
                                  <span className="inline-flex items-center text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50">
                                    컷팅:{order.raw.cutting_type || '없음'}
                                  </span>
                                  <span className="inline-flex items-center text-[10px] font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/50">
                                    {order.raw.type || '미지정'}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-300">-</span>
                              )}
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className="text-sm font-bold text-slate-900">{order.raw.quantity}EA</span>
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
                        <div className="flex justify-between text-sm"><span className="text-slate-500">외경:</span><span className="font-bold text-slate-800">{industrialSettings.outerDiameter === '직접입력' ? industrialSettings.customOuterDiameter : industrialSettings.outerDiameter}mm</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">내경:</span><span className="font-bold text-slate-800">{industrialSettings.innerDiameter === '직접 입력' ? industrialSettings.customInnerDiameter : industrialSettings.innerDiameter}mm</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">홀가공:</span><span className="font-bold text-slate-800">{industrialSettings.holeProcessing === '직접 입력' ? industrialSettings.customHoleProcessing : industrialSettings.holeProcessing}{(!isNaN(Number(industrialSettings.holeProcessing)) || (industrialSettings.holeProcessing === '직접 입력' && !isNaN(Number(industrialSettings.customHoleProcessing)))) ? 'Φ' : ''}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">타입:</span><span className="font-bold text-slate-800">{industrialSettings.type}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">스폰지 길이:</span><span className="font-bold text-slate-800">{industrialSettings.spongeLength}mm</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">전체 길이:</span><span className="font-bold text-slate-800">{industrialSettings.totalLength}mm</span></div>
                        <div className="flex justify-between text-sm border-t border-slate-100 pt-2"><span className="text-slate-500">총 수량:</span><span className="font-bold text-brand-600">{industrialSettings.quantity}EA</span></div>
                        <div className="flex justify-between text-sm border-t border-slate-100 pt-2"><span className="text-slate-500">개별 포장:</span><span className="font-bold text-slate-800">{industrialSettings.individualPackaging ? '예' : '아니오'}</span></div>
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
                          outer_diameter: industrialSettings.outerDiameter === '직접입력' ? industrialSettings.customOuterDiameter : industrialSettings.outerDiameter,
                          inner_diameter: industrialSettings.innerDiameter === '직접 입력' ? industrialSettings.customInnerDiameter : industrialSettings.innerDiameter,
                          hole_processing: industrialSettings.holeProcessing === '직접 입력' ? industrialSettings.customHoleProcessing : industrialSettings.holeProcessing,
                          type: industrialSettings.type,
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