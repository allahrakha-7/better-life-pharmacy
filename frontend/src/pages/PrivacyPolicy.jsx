import { ArrowLeft, ShieldCheck, Lock, EyeOff, FileLock } from 'lucide-react';

export default function PrivacyPolicy({ onNavigate }) {
    return (
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 pb-24 space-y-10 animate-fade-in">
            {/* Header */}
            <div>
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#006a4e] hover:text-[#00543e] cursor-pointer mb-4"
                >
                    <ArrowLeft size={16} /> Return to Home
                </button>
                <span className="text-xs font-bold text-[#006a4e] uppercase tracking-wider block">Legal Center</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-1">Privacy Policy</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Last Updated: June 25, 2026</p>
            </div>

            {/* Introduction Card */}
            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 bg-white text-[#006a4e] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                    <ShieldCheck size={24} />
                </div>
                <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-800 text-base md:text-lg">Your Privacy is Our Priority</h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                        At Better Life Pharmacy, we are dedicated to protecting your medical records and personal health details. This policy governs how we collect, process, and safeguard prescription uploads and order history.
                    </p>
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 text-slate-700 font-semibold text-xs md:text-sm leading-relaxed">

                {/* Section 1 */}
                <div className="space-y-3">
                    <h3 className="font-black text-slate-800 text-base md:text-lg flex items-center gap-2">
                        <Lock size={18} className="text-[#006a4e]" />
                        1. Information We Collect
                    </h3>
                    <p className="text-slate-500">
                        To fulfill your medicine orders and verify compliance with health authorities, we collect:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-500">
                        <li>Personal Identification details (Name, delivery addresses, phone number, and email).</li>
                        <li>Uploaded Doctor Prescriptions (including clinic stamps, doctor names, and diagnosed medication details).</li>
                        <li>Order transaction histories and billing preference options.</li>
                    </ul>
                </div>

                {/* Section 2 */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h3 className="font-black text-slate-800 text-base md:text-lg flex items-center gap-2">
                        <FileLock size={18} className="text-[#006a4e]" />
                        2. How We Protect Your Medical Records
                    </h3>
                    <p className="text-slate-500">
                        All prescription uploads are encrypted using secure sockets layer (SSL) technology and stored on secure cloud services. Access to your medical uploads is restricted solely to licensed pharmacists on duty who verify and authorize order releases.
                    </p>
                </div>

                {/* Section 3 */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h3 className="font-black text-slate-800 text-base md:text-lg flex items-center gap-2">
                        <EyeOff size={18} className="text-[#006a4e]" />
                        3. Sharing of Health Data
                    </h3>
                    <p className="text-slate-500">
                        We do not sell, rent, or trade your medical history with third-party marketers. Data is only shared with:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-500">
                        <li>Affiliated licensed pharmacists and medical reviewers validating prescription authenticity.</li>
                        <li>Courier networks for delivery dispatch (limited to shipping name, destination address, and phone number).</li>
                    </ul>
                </div>

                {/* Section 4 */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h3 className="font-black text-slate-800 text-base md:text-lg">
                        4. Cookies & Web Tracking
                    </h3>
                    <p className="text-slate-500">
                        We use minimal local cookies to remember items in your shopping cart, coordinate theme settings (light/dark mode), and maintain your login state. These do not trace external browsing behaviors.
                    </p>
                </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-slate-100 flex justify-center">
                <button
                    onClick={() => onNavigate('home')}
                    className="bg-[#006a4e] hover:bg-[#00543e] active:scale-95 text-white font-bold py-3 px-8 rounded-full text-xs md:text-sm shadow-md transition-all cursor-pointer"
                >
                    Acknowledge & Close
                </button>
            </div>
        </div>
    );
}
