export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#004d38] text-emerald-100/70 py-16 border-t border-emerald-800/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">Better Life</span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-100/60">
            Your trusted partner in health and wellness. Bringing authentic medicines and premium healthcare services to your doorstep across Pakistan.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Quick Links</h4>
          <ul className="space-y-3 text-xs font-semibold">
            <li><button onClick={() => onNavigate('home')} className="text-emerald-100/80 hover:text-[#dffe5e] transition-colors cursor-pointer text-left font-semibold bg-transparent border-none outline-none">Home</button></li>
            <li><button onClick={() => onNavigate('medicines')} className="text-emerald-100/80 hover:text-[#dffe5e] transition-colors cursor-pointer text-left font-semibold bg-transparent border-none outline-none">Browse Medicines</button></li>
            <li><button onClick={() => onNavigate('cart')} className="text-emerald-100/80 hover:text-[#dffe5e] transition-colors cursor-pointer text-left font-semibold bg-transparent border-none outline-none">View Cart</button></li>
            <li><button onClick={() => onNavigate('upload-prescription')} className="text-emerald-100/80 hover:text-[#dffe5e] transition-colors cursor-pointer text-left font-semibold bg-transparent border-none outline-none">Upload Prescription</button></li>
            <li><button onClick={() => onNavigate('track-order')} className="text-emerald-100/80 hover:text-[#dffe5e] transition-colors cursor-pointer text-left font-semibold bg-transparent border-none outline-none">Track Order</button></li>
            <li><button onClick={() => onNavigate('admin')} className="text-emerald-100/80 hover:text-[#dffe5e] transition-colors cursor-pointer text-left font-semibold bg-transparent border-none outline-none">Admin Portal</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Services</h4>
          <ul className="space-y-3 text-xs font-semibold text-emerald-100/60">
            <li>Prescription Refills</li>
            <li>OTC Supplies</li>
            <li>Baby Care Products</li>
            <li>Medical Consultations</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Support</h4>
          <p className="text-xs text-emerald-100/60 leading-relaxed">
            Have questions? Our qualified pharmacists are online 24/7.
          </p>
          <div className="mt-5 pt-1">
            <span className="text-xs font-bold text-[#dffe5e] block tracking-wide uppercase">Call Helpline</span>
            <span className="text-base font-extrabold text-white">0800-BETTER-LIFE</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-emerald-800/60 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-100/50 font-semibold gap-4">
        <span>&copy; {new Date().getFullYear()} Better Life Pharmacy. All rights reserved.</span>
        <div className="flex gap-4">
          <button onClick={() => onNavigate('terms-conditions')} className="hover:text-white transition-colors cursor-pointer font-semibold bg-transparent border-none outline-none">Terms & Conditions</button>
          <span>&bull;</span>
          <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition-colors cursor-pointer font-semibold bg-transparent border-none outline-none">Privacy Policy</button>
        </div>
      </div>
    </footer>
  );
}
