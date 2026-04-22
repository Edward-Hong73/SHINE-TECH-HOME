import { motion } from 'motion/react';
import { Settings, ShieldCheck, Award, CheckCircle2, Factory, FlaskConical, Target as TargetIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BackButton from '../components/BackButton';

export default function Technology() {
  const { t } = useLanguage();

  const steps = [
    {
      title: t.tech.step1,
      desc: t.tech.step1Desc,
      icon: <FlaskConical className="w-8 h-8" />
    },
    {
      title: t.tech.step2,
      desc: t.tech.step2Desc,
      icon: <Settings className="w-8 h-8" />
    },
    {
      title: t.tech.step3,
      desc: t.tech.step3Desc,
      icon: <Factory className="w-8 h-8" />
    },
    {
      title: t.tech.step4,
      desc: t.tech.step4Desc,
      icon: <TargetIcon className="w-8 h-8" />
    }
  ];

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <BackButton />
        {/* Production Process */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{t.tech.title}</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t.tech.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/4 left-full w-full h-[2px] bg-slate-100 -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quality & Certifications */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.tech.qualityTitle}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t.tech.qualityDesc}
              </p>
              
              <div className="space-y-4">
                {[
                  t.tech.cert1,
                  t.tech.cert2,
                  t.tech.cert3,
                  t.tech.cert4
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center group hover:border-brand-300 transition-colors cursor-pointer">
                  <Award className="w-12 h-12 text-slate-300 mb-4 group-hover:text-brand-500 transition-colors" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.tech.certificate} {i}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
