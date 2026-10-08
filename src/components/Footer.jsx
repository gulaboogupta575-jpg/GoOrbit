import React from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  Globe
} from 'lucide-react';

export default function Footer({ setActiveCategory, onOpenCustomTrip }) {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-heading">
                go<span className="text-blue-500">orbit</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your futuristic tour & travel platform. Experience <strong>10 India Destinations</strong> (with 4-5 places each), 
              <strong> 11 International Destinations</strong>, and <strong>6 Adventure Sports</strong> with real-time flight, train, and bus cost breakdowns.
            </p>

            <div className="pt-2 text-xs space-y-2">
              <a 
                href="https://wa.me/917304363139?text=Hello%20Go%20Orbit"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>24/7 Helpline: +91 7304363139</span>
              </a>
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@go-orbit.travel</span>
              </div>
            </div>
          </div>

          {/* Column 2: India Tours (10 Hubs) */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              🇮🇳 India Tours (10 Hubs)
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              {['Shimla-Manali', 'Delhi-Goa', 'Kashmir', 'Mumbai', 'Kerala', 'Jaipur', 'Andaman-Nicobar', 'Darjeeling', 'Leh-Ladakh', 'Meghalaya'].map(dest => (
                <li key={dest}>
                  <button
                    onClick={() => {
                      setActiveCategory('india');
                      const el = document.getElementById('destinations-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {dest} (4-5 Places)
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: International Tours (11 Hubs) */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              ✈️ International (11 Hubs)
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              {['Dubai & Abu Dhabi', 'Japan (Tokyo/Kyoto)', 'Bali', 'Turkey', 'Switzerland', 'London', 'Paris', 'Singapore', 'Malaysia', 'Maldives', 'USA'].map(dest => (
                <li key={dest}>
                  <button
                    onClick={() => {
                      setActiveCategory('international');
                      const el = document.getElementById('destinations-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {dest}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Adventure & Features */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              🏔️ Adventure & Perks
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              {['Alpine Trekking', 'White Water Rafting', 'Tandem Paragliding', 'Wilderness Camping', 'Scuba Diving', '83m Bungee Jumping'].map(adv => (
                <li key={adv}>
                  <button
                    onClick={() => {
                      setActiveCategory('adventure');
                      const el = document.getElementById('destinations-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {adv}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={onOpenCustomTrip}
                  className="text-amber-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Build Custom Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Security, Payment Badges & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified 256-Bit SSL Secured Checkout</span>
            </span>
            <span>•</span>
            <span>UPI • RuPay • Visa • MasterCard • NetBanking</span>
          </div>

          <p>© {new Date().getFullYear()} Go Orbit Travels Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
