import { motion } from 'motion/react';
import { Globe, Microscope, ShieldCheck, Award, Users, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BackButton from '../components/BackButton';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <BackButton />
      </div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-slate-900 mb-24">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Corporate Office" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-slate-950" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold text-white mb-4">{t.about.heroTitle}</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t.about.heroDesc}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* R&D Center */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4 block">{t.about.rdBadge}</span>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">{t.about.rdTitle}</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {t.about.rdDesc}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Microscope className="text-brand-600 w-8 h-8 mb-3" />
                <h4 className="font-bold mb-1">{t.about.rdFeature1}</h4>
                <p className="text-xs text-slate-500">{t.about.rdFeature1Desc}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Target className="text-brand-600 w-8 h-8 mb-3" />
                <h4 className="font-bold mb-1">{t.about.rdFeature2}</h4>
                <p className="text-xs text-slate-500">{t.about.rdFeature2Desc}</p>
              </div>
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-100 rounded-3xl -rotate-2" />
            <img 
              src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000" 
              alt="Lab Research" 
              className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Global Network */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <Globe className="w-full h-full scale-150" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">{t.about.globalTitle}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-lg">
              {t.about.globalDesc}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: t.about.stat1, value: "45+" },
                { label: t.about.stat2, value: "200+" },
                { label: t.about.stat3, value: "120+" },
                { label: t.about.stat4, value: "25+" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-bold text-brand-500 mb-2">{stat.value}</div>
                  <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
