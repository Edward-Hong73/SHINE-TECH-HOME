import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';
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

// 스펀지 롤러 단가 계산 (가격표 기준)
function calcRollerUnitPrice(order: any): number {
  const outer = parseInt(order.outer_diameter) || 0;
  const inner = parseInt(order.inner_diameter) || 0;
  const spongeLen = parseInt(order.sponge_length) || 0;
  const totalLen = parseInt(order.total_length) || 0;
  const company = (order.company_name || '').trim();

  // 특수 규격 고정 단가 (외경*내경*스폰지길이)
  let basePrice = 0;
  if (outer === 100 && inner === 40 && spongeLen === 300) basePrice = 26000;
  else if (outer === 100 && inner === 20 && spongeLen === 215) basePrice = 31000;
  else if (outer === 83 && inner === 20 && spongeLen === 215) basePrice = 26000;
  else {
    // 기본 가격표: 외경 × 전체길이(PVC 파이프 길이) 기준
    const isLong = totalLen > 740;
    const table: Record<number, [number, number]> = {
      32: [17000, 19000], 35: [17000, 19000],
      40: [17000, 19000], 45: [17000, 19000],
      50: [19000, 22000], 55: [22000, 25000],
      60: [25000, 28000], 65: [31000, 35000],
    };
    basePrice = table[outer] ? (isLong ? table[outer][1] : table[outer][0]) : 0;
  }

  // 후가공비 +3,000원 (스폰지길이 == 전체길이 또는 삼광기업사면 면제)
  const noSurcharge = spongeLen === totalLen || company.includes('삼광');
  return basePrice + (noSurcharge ? 0 : 3000);
}

// 주문 데이터에서 선택 가능한 필드 목록
const ORDER_FIELDS = [
  { value: '', label: '(빈값)' },
  { value: '__year__', label: '거래연도 (자동)' },
  { value: '__month__', label: '거래월 (자동)' },
  { value: '__date__', label: '주문접수일자 (자동)' },
  { value: 'company_name', label: '주문처 (업체명)' },
  { value: 'type', label: '종류' },
  { value: 'outer_diameter', label: '외경 [롤러]' },
  { value: 'inner_diameter', label: '내경 [롤러]' },
  { value: 'sponge_length', label: '스폰지길이 [롤러]' },
  { value: 'total_length', label: '전체길이 [롤러]' },
  { value: 'hole_processing', label: '단자가공 [롤러]' },
  { value: 'cutting_type', label: '컷팅 [롤러]' },
  { value: 'diameter', label: '직경 [클린싱 원형]' },
  { value: '__cleansing_size__', label: '규격 (width*height 또는 Ø직경) [클린싱]' },
  { value: 'thickness', label: '두께 [클린싱]' },
  { value: 'color', label: '색상' },
  { value: 'quantity', label: '주문수량' },
  { value: 'notes', label: '비고' },
  { value: 'business_number', label: '사업자번호' },
  { value: 'orderer_name', label: '주문자명' },
  { value: '__fixed_사인__', label: '고정값: 사인' },
  { value: '__unit_price__', label: '단가 (자동계산) [롤러]' },
];

function getFieldValue(order: any, fieldKey: string): any {
  const now = new Date();
  if (fieldKey === '__year__') return now.getFullYear();
  if (fieldKey === '__month__') return now.getMonth() + 1;
  if (fieldKey === '__date__') {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  if (fieldKey === '__fixed_사인__') return '사인';
  if (fieldKey === '__cleansing_size__') {
    return order.type === '원형' ? `Ø${order.diameter}` : `${order.width}*${order.height}`;
  }
  if (fieldKey === '__unit_price__') {
    if (order.product_category !== '롤러') return '';
    return calcRollerUnitPrice(order) || '';
  }
  if (fieldKey === '') return '';
  return order[fieldKey] ?? '';
}

export default function Admin() {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | '롤러' | '클린싱'>('all');
  const [hideCompleted, setHideCompleted] = useState(false);
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);
  const [excelSheetName, setExcelSheetName] = useState<string>('');
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<string[]>([]);
  const [isMappingOpen, setIsMappingOpen] = useState(false);

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

  const selectExcelFile = async () => {
    try {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [{
          description: 'Excel 파일',
          accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
          },
        }],
      });
      fileHandleRef.current = handle;

      // 파일 읽어서 "주문" 시트 헤더 추출
      const file = await handle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames.find((n: string) => n === '주문') ?? workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // 헤더 행 찾기: 값이 가장 많은 행을 헤더로 사용 (보통 2번째 행)
      let headerRow: any[] = [];
      for (const row of rows) {
        if (row.filter(Boolean).length > headerRow.filter(Boolean).length) headerRow = row;
      }
      const headers = headerRow.map((h: any) => String(h ?? ''));

      setExcelSheetName(sheetName);
      setExcelHeaders(headers);
      // 초기 매핑은 빈값으로
      setColumnMapping(new Array(headers.length).fill(''));
      setIsMappingOpen(true);
    } catch (e) {
      // 사용자가 취소한 경우 무시
    }
  };

  const appendToExcel = async (order: any) => {
    try {
      if (!fileHandleRef.current) {
        await selectExcelFile();
        if (!fileHandleRef.current) return; // 취소한 경우
      }
      if (columnMapping.length === 0) {
        alert('먼저 엑셀 파일을 연결하고 컬럼 매핑을 완료해 주세요.');
        return;
      }

      const handle = fileHandleRef.current!;
      const file = await handle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // "주문" 시트 우선, 없으면 첫 번째 시트
      const sheetName = workbook.SheetNames.find(n => n === '주문') ?? workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 매핑 설정에 따라 새 행 구성
      const newRow = columnMapping.map(fieldKey => getFieldValue(order, fieldKey));

      // 기존 서식·데이터 유지하며 마지막 행 뒤에 추가
      XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });

      const isXls = handle.name.toLowerCase().endsWith('.xls');
      const wbout = XLSX.write(workbook, { bookType: isXls ? 'biff8' : 'xlsx', type: 'array' });

      const writable = await handle.createWritable();
      await writable.write(wbout);
      await writable.close();

    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        console.error('엑셀 저장 오류:', e);
        alert('엑셀 저장 중 오류가 발생했습니다.');
      }
    }
  };

  const updateStatus = async (orderId: number, newStatus: string, category: string) => {
    const tableName = category === '롤러' ? 'order_roller_shine' : 'order_cleansing_shine';
    const { error } = await supabase.from(tableName).update({ status: newStatus }).eq('id', orderId);

    if (error) {
      alert('상태 업데이트 중 오류가 발생했습니다.');
    } else {
      setOrders(prev => prev.map(o => o.id === orderId && o.product_category === category ? { ...o, status: newStatus } : o));

      // 주문접수로 변경 시 엑셀에 자동 저장
      if (newStatus === '주문접수') {
        const order = orders.find(o => o.id === orderId && o.product_category === category);
        if (order) await appendToExcel({ ...order, status: newStatus });
      }
    }
  };

  const filterOrder = (order: any) => {
    const matchesSearch =
      order.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);
    const matchesCategory = filterCategory === 'all' || order.product_category === filterCategory;
    const matchesCompleted = hideCompleted ? order.status !== '출하 완료' : true;
    return matchesSearch && matchesCategory && matchesCompleted;
  };

  const cancelOrder = async (orderId: number, category: string) => {
    if (!confirm('이 주문을 취소(삭제)하시겠습니까?')) return;
    const tableName = category === '롤러' ? 'order_roller_shine' : 'order_cleansing_shine';
    const { error } = await supabase.from(tableName).delete().eq('id', orderId);
    if (error) {
      alert('주문 취소 중 오류가 발생했습니다.');
    } else {
      setOrders(prev => prev.filter(o => !(o.id === orderId && o.product_category === category)));
    }
  };

  const sortOrders = (list: any[]) =>
    list.sort((a, b) => {
      const aCompleted = a.status === '출하 완료' ? 1 : 0;
      const bCompleted = b.status === '출하 완료' ? 1 : 0;
      if (aCompleted !== bCompleted) return aCompleted - bCompleted;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const filteredRollerOrders = sortOrders(orders.filter(o => o.product_category === '롤러').filter(filterOrder));
  const filteredCleansingOrders = sortOrders(orders.filter(o => o.product_category === '클린싱').filter(filterOrder));

  const stats = {
    total: orders.length,
    roller: orders.filter(o => o.product_category === '롤러').length,
    cleansing: orders.filter(o => o.product_category === '클린싱').length
  };

  return (
    <>
    {/* 컬럼 매핑 모달 */}
    <AnimatePresence>
      {isMappingOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsMappingOpen(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">엑셀 컬럼 매핑 설정</h2>
                <p className="text-xs text-slate-400 mt-0.5">시트: <span className="font-bold text-slate-600">{excelSheetName}</span> · 파일: <span className="font-bold text-slate-600">{fileHandleRef.current?.name}</span></p>
              </div>
              <button onClick={() => setIsMappingOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2">✕</button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <p className="text-xs text-slate-500 mb-4">각 엑셀 컬럼에 어떤 주문 데이터를 저장할지 선택하세요.</p>
              <div className="space-y-2">
                {excelHeaders.map((header, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 text-center text-[10px] font-bold text-slate-400 bg-slate-100 rounded px-1 py-1 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="w-32 shrink-0">
                      <span className="text-xs font-bold text-slate-700 truncate block">{header || '(빈 헤더)'}</span>
                    </div>
                    <div className="text-slate-300 shrink-0">→</div>
                    <select
                      value={columnMapping[idx] ?? ''}
                      onChange={(e) => {
                        const updated = [...columnMapping];
                        updated[idx] = e.target.value;
                        setColumnMapping(updated);
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500/20 outline-none"
                    >
                      {ORDER_FIELDS.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsMappingOpen(false)}
                className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => setIsMappingOpen(false)}
                className="px-6 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors"
              >
                저장
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

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
            {fileHandleRef.current ? (
              <div className="flex items-center gap-1">
                <span className="px-3 py-3 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-2xl text-xs font-bold shadow-sm" title={`연결됨: ${fileHandleRef.current.name}`}>
                  📊 {fileHandleRef.current.name}
                </span>
                <button
                  onClick={() => setIsMappingOpen(true)}
                  className="px-3 py-3 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-colors shadow-sm"
                  title="컬럼 매핑 설정"
                >
                  ⚙️ 매핑
                </button>
              </div>
            ) : (
              <button
                onClick={selectExcelFile}
                className="px-3 py-3 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-colors shadow-sm"
              >
                📊 엑셀 연결
              </button>
            )}
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

        {/* Orders Sections */}
        {isOrdersLoading ? (
          <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center py-24">
            <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* 롤러 섹션 */}
            {(filterCategory === 'all' || filterCategory === '롤러') && (
              <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center space-x-3 bg-blue-50/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h2 className="text-sm font-black text-blue-700 tracking-tight">산업용 롤러 주문</h2>
                  <span className="ml-auto text-xs font-bold text-blue-400 bg-blue-100 px-2.5 py-0.5 rounded-full">{filteredRollerOrders.length}건</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">주문 날짜</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">주문 업체</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">규격 (外*內*L*TL)</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">홀/컷팅/타입</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">수량/포장</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">진행 상태</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">취소</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredRollerOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-14 text-center text-slate-400 font-medium text-sm">
                            해당 조건의 롤러 주문이 없습니다.
                          </td>
                        </tr>
                      ) : filteredRollerOrders.map((order) => (
                        <tr
                          key={`roller-${order.id}`}
                          className={cn(
                            "transition-colors group",
                            order.status === '주문 요청' && "bg-sky-50/60 hover:bg-sky-50",
                            order.status !== '주문 요청' && order.status !== '출하 완료' && "hover:bg-slate-50/80",
                            order.status === '출하 완료' && "opacity-40 hover:bg-slate-50/40"
                          )}
                        >
                          <td className="px-6 py-5">
                            <span className="text-[11px] font-bold text-slate-600">
                              {`${new Date(order.created_at).getMonth() + 1}.${new Date(order.created_at).getDate()}`}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm font-bold text-slate-900">{order.company_name}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                              {`${order.outer_diameter}*${order.inner_diameter}*${order.sponge_length}*${order.total_length}`}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/50">홀:{order.hole_processing || '없음'}</span>
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50">컷팅:{order.cutting_type || '없음'}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium">{order.type || '미지정'}</span>
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
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => cancelOrder(order.id, order.product_category)}
                              className="px-2.5 py-1.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-colors"
                            >
                              취소
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 클린싱 섹션 */}
            {(filterCategory === 'all' || filterCategory === '클린싱') && (
              <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center space-x-3 bg-pink-50/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <h2 className="text-sm font-black text-pink-700 tracking-tight">미용 클린싱 주문</h2>
                  <span className="ml-auto text-xs font-bold text-pink-400 bg-pink-100 px-2.5 py-0.5 rounded-full">{filteredCleansingOrders.length}건</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">주문 날짜</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">주문 업체</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">형태</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">규격 (mm)</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">색상</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">수량</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">진행 상태</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">취소</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredCleansingOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-14 text-center text-slate-400 font-medium text-sm">
                            해당 조건의 클린싱 주문이 없습니다.
                          </td>
                        </tr>
                      ) : filteredCleansingOrders.map((order) => (
                        <tr
                          key={`cleansing-${order.id}`}
                          className={cn(
                            "transition-colors group",
                            order.status === '주문 요청' && "bg-pink-50/60 hover:bg-pink-50",
                            order.status !== '주문 요청' && order.status !== '출하 완료' && "hover:bg-slate-50/80",
                            order.status === '출하 완료' && "opacity-40 hover:bg-slate-50/40"
                          )}
                        >
                          <td className="px-6 py-5">
                            <span className="text-[11px] font-bold text-slate-600">
                              {`${new Date(order.created_at).getMonth() + 1}.${new Date(order.created_at).getDate()}`}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm font-bold text-slate-900">{order.company_name}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-100/50">
                              {order.type}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                              {order.type === '원형' ? `Ø${order.diameter} / t${order.thickness}` : `${order.width}*${order.height} / t${order.thickness}`}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[9px] font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100/50">{order.color}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm font-bold text-pink-600">{order.quantity}EA</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <select
                              value={order.status || '주문 요청'}
                              onChange={(e) => updateStatus(order.id, e.target.value, order.product_category)}
                              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-pink-500/20 outline-none cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
                            >
                              {STATUS_STEPS.map(step => (
                                <option key={step} value={step}>{step}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => cancelOrder(order.id, order.product_category)}
                              className="px-2.5 py-1.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-colors"
                            >
                              취소
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
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
