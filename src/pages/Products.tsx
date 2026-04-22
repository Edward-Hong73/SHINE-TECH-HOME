import { motion } from 'motion/react';
import { products } from '../data/content';
import { Download, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import BackButton from '../components/BackButton';

export default function Products() {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<'All' | 'Industrial' | 'Cosmetic'>('All');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    (filter === 'All' || p.category === filter) &&
    (p.name[language].toLowerCase().includes(search.toLowerCase()) || p.description[language].toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <BackButton />
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t.products.title}</h1>
          <p className="text-slate-600 max-w-2xl">
            {t.products.desc}
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            {['All', 'Industrial', 'Cosmetic'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={cn(
                  "px-6 py-2 text-sm font-semibold rounded-lg transition-all w-full md:w-auto",
                  filter === cat ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {cat === 'All' ? t.products.filterAll : cat === 'Industrial' ? t.products.filterIndustrial : t.products.filterCosmetic}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder={t.products.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-12">
          {filteredProducts.map((product) => (
            <motion.div 
              layout
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col lg:flex-row"
            >
              <div className="lg:w-1/3 relative group overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name[language]} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full text-white",
                    product.category === 'Industrial' ? "bg-brand-600" : "bg-pink-500"
                  )}>
                    {product.category === 'Industrial' ? t.products.filterIndustrial : t.products.filterCosmetic}
                  </span>
                </div>
              </div>
              
              <div className="lg:w-2/3 p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{product.name[language]}</h3>
                    <p className="text-slate-600 leading-relaxed">{product.description[language]}</p>
                  </div>
                  <button className="flex items-center space-x-2 text-brand-600 font-bold hover:text-brand-700 transition-colors shrink-0">
                    <Download className="w-5 h-5" />
                    <span>{t.products.dataSheet}</span>
                  </button>
                </div>

                {/* Specs Table */}
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-medium">
                        <th className="pb-3 pr-4">{t.products.specs.od}</th>
                        <th className="pb-3 pr-4">{t.products.specs.id}</th>
                        <th className="pb-3 pr-4">{t.products.specs.hardness}</th>
                        <th className="pb-3 pr-4">{t.products.specs.pore}</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700 font-semibold">
                      <tr>
                        <td className="pt-4 pr-4">{product.specs.outerDiameter}</td>
                        <td className="pt-4 pr-4">{product.specs.innerDiameter}</td>
                        <td className="pt-4 pr-4">{product.specs.hardness}</td>
                        <td className="pt-4 pr-4">{product.specs.poreSize}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.features[language].map((feature, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs rounded-full border border-slate-100">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg">{t.products.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}
