import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { faqs } from '../data/content';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import BackButton from '../components/BackButton';

export default function Contact() {
  const { language, t } = useLanguage();
  const location = useLocation();
  const [formType, setFormType] = useState<'General' | 'Quote'>('General');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (location.pathname === '/quote' || (location.state && (location.state as any).type === 'quote')) {
      setFormType('Quote');
    } else {
      setFormType('General');
    }
  }, [location.pathname, location.state]);

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Contact Info */}
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-6">
              {formType === 'Quote' ? t.hero.ctaQuote : t.contact.title}
            </h1>
            <p className="text-slate-600 mb-12 text-lg">
              {formType === 'Quote' ? t.contact.desc.replace('기술 문의나 ', '') : t.contact.desc}
            </p>

            <div className="space-y-8 mb-16">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.contact.hq}</h4>
                  <p className="text-slate-500">{t.footer.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="text-brand-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.contact.phone}</h4>
                  <p className="text-slate-500">{t.footer.phoneHours}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="text-brand-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.contact.email}</h4>
                  <p className="text-slate-500">sales@shinetech.com / support@shinetech.com</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <HelpCircle className="mr-2 w-6 h-6 text-brand-600" />
                {t.contact.faqTitle}
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full p-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-700">{faq.question[language]}</span>
                      <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", activeFaq === idx && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {activeFaq === idx && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-slate-500 text-sm leading-relaxed">
                            {faq.answer[language]}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Dynamic Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
              <button
                onClick={() => setFormType('General')}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                  formType === 'General' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500"
                )}
              >
                {t.contact.formGeneral}
              </button>
              <button
                onClick={() => setFormType('Quote')}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                  formType === 'Quote' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500"
                )}
              >
                {t.contact.formQuote}
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.contact.labelName}</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder={t.contact.placeholderName} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.contact.labelEmail}</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder={t.contact.placeholderEmail} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.contact.labelCompany}</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder={t.contact.placeholderCompany} />
              </div>

              {formType === 'Quote' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.contact.labelCategory}</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none">
                      <option>{t.products.filterIndustrial}</option>
                      <option>{t.products.filterCosmetic}</option>
                      <option>{t.tech.step4}</option>
                      <option>{t.about.rdFeature2}</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.contact.labelQuantity}</label>
                      <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.contact.labelPore}</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 0.1" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.contact.labelMessage}</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder={t.contact.placeholderMessage}></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all flex items-center justify-center space-x-2">
                <Send className="w-5 h-5" />
                <span>{t.contact.btnSend}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
