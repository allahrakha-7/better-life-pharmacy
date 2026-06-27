import { ArrowLeft, Scale, FileSignature, AlertCircle } from 'lucide-react';

export default function TermsConditions({ onNavigate }) {
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
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-1">Terms & Conditions</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Last Updated: June 25, 2026</p>
            </div>

            {/* Note Card */}
            <div className="bg-amber-50/50 border border-amber-100/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 bg-white text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                    <Scale size={24} />
                </div>
                <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-800 text-base md:text-lg">Legal Binding Agreement</h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                        By browsing Better Life Pharmacy, creating an account, or uploading medical orders, you agree to comply with our purchasing terms and the Pharmacy Act regulatory guidelines.
                    </p>
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 text-slate-700 font-semibold text-xs md:text-sm leading-relaxed">
                
                {/* Section 1 */}
                <div className="space-y-3">
                    <h3 className="font-black text-slate-800 text-base md:text-lg flex items-center gap-2">
                        <FileSignature size={18} className="text-[#006a4e]" />
                        1. Prescription Mandate Policy
                    </h3>
                    <p className="text-slate-500">
                        In accordance with the Drug Regulatory Authority of Pakistan (DRAP) laws:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-500">
                        <li>Schedule G and Schedule H medicines (e.g. antibiotics, psychotropics, cardiovascular drugs) **will not** be dispensed without a valid, signed doctor prescription.</li>
                        <li>Uploaded prescriptions must show the doctor's registration stamp, patient's full name, and clear dosage details.</li>
                        <li>Better Life Pharmacy reserves the right to reject orders if the uploaded slip is expired, forged, or unreadable.</li>
                    </ul>
                </div>

                {/* Section 2 */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h3 className="font-black text-slate-800 text-base md:text-lg flex items-center gap-2">
                        <AlertCircle size={18} className="text-[#006a4e]" />
                        2. Delivery & Cash-on-Delivery (COD)
                    </h3>
                    <p className="text-slate-500">
                        Deliveries are subject to verification calls. Standard shipping takes 24 to 48 hours for main cities. For Cash-on-Delivery, customers must pay the courier before breaking package seals or opening medicine containers.
                    </p>
                </div>

                {/* Section 3 */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h3 className="font-black text-slate-800 text-base md:text-lg">
                        3. Returns & Refunds
                    </h3>
                    <p className="text-slate-500">
                        Due to pharmaceutical safety and temperature storage compliance rules, **dispensed medicines cannot be returned or refunded** unless the item delivered was incorrect or expired. Claims must be submitted within 24 hours of package receipt.
                    </p>
                </div>

                {/* Section 4 */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h3 className="font-black text-slate-800 text-base md:text-lg">
                        4. Disclaimer & Limitations
                    </h3>
                    <p className="text-slate-500">
                        Product descriptions and health articles on this web portal do not substitute for professional medical consults. Always discuss health changes directly with qualified doctors.
                    </p>
                </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-slate-100 flex justify-center">
                <button 
                    onClick={() => onNavigate('home')}
                    className="bg-[#006a4e] hover:bg-[#00543e] active:scale-95 text-white font-bold py-3 px-8 rounded-full text-xs md:text-sm shadow-md transition-all cursor-pointer"
                >
                    Accept Terms
                </button>
            </div>
        </div>
    );
}
