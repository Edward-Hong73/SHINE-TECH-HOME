import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t, nav } = useLanguage();
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter">
                SHINE<span className="text-brand-500">TECH</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">{t.footer.solutions}</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/products" className="hover:text-white transition-colors">{t.footer.industrialRollers}</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">{t.footer.cosmeticSponges}</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">{t.footer.cleanroomSheets}</Link></li>
              <li><Link to="/technology" className="hover:text-white transition-colors">{t.footer.customRD}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">{t.footer.company}</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/technology" className="hover:text-white transition-colors">{t.nav.tech}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t.footer.globalNetwork}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t.footer.careers}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">{t.footer.contact}</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-500 shrink-0" />
                <span>{t.footer.phoneHours}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-500 shrink-0" />
                <span>magic3973@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 SHINE TECH Global. {t.footer.rights}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">{t.footer.privacyPolicy}</a>
            <a href="#" className="hover:text-white">{t.footer.termsOfService}</a>
            <a href="#" className="hover:text-white">{t.footer.cookieSettings}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
