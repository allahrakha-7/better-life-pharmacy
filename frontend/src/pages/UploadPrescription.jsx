import { useState } from 'react';
import { Upload, ArrowLeft, CheckCircle2, ShieldAlert, ClipboardList } from 'lucide-react';
import { medicineService } from '../services/medicineService';

export default function UploadPrescription({ onNavigate }) {
    const [file, setFile] = useState(null);
    const [patientName, setPatientName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !patientName || !phone) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('prescription', file);
        formData.append('patientName', patientName);
        formData.append('phone', phone);
        formData.append('notes', notes);

        try {
            const res = await medicineService.uploadPrescription(formData);
            const ref = res.prescription?._id || `BLP-RX-${Date.now().toString().slice(-6)}`;
            setTrackingNumber(ref);
            setIsSubmitted(true);
        } catch (err) {
            console.error("Prescription upload failed:", err);
            setError(err.message || "Failed to upload prescription. Please verify the file type and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-8 animate-fade-in">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#006a4e] animate-bounce">
                    <CheckCircle2 size={48} />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-extrabold text-slate-800">Prescription Uploaded!</h2>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Our certified pharmacist is reviewing your prescription. We will contact you at <span className="font-bold text-slate-800">{phone}</span> shortly to confirm the medicines and complete your order.
                    </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-left space-y-3 max-w-md mx-auto">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>REFERENCE NUMBER</span>
                        <span>STATUS</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-800 text-sm md:text-base break-all select-all">{trackingNumber}</span>
                        <span className="bg-[#dffe5e] text-[#033126] text-[10px] font-bold px-3 py-1 rounded-full uppercase shrink-0">
                            Under Review
                        </span>
                    </div>
                </div>

                <div className="flex gap-4 max-w-md mx-auto">
                    <button
                        onClick={() => onNavigate('home')}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-full text-sm transition-all cursor-pointer"
                    >
                        Go Home
                    </button>
                    <button
                        onClick={() => onNavigate('medicines')}
                        className="flex-1 bg-[#006a4e] hover:bg-[#00543e] text-white font-bold py-3.5 px-6 rounded-full text-sm shadow-md transition-all cursor-pointer"
                    >
                        Browse Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 space-y-8">
            {/* Breadcrumbs / Header */}
            <div>
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#006a4e] hover:text-[#00543e] cursor-pointer mb-2"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Upload Prescription</h1>
                <p className="text-xs md:text-sm text-slate-400 mt-1 font-medium">Get your prescription medicines verified and delivered directly to your home.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-2xl text-xs md:text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Upload Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6">
                    {/* Drag and Drop Zone */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-800">Prescription Copy <span className="text-red-500">*</span></label>
                        <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl py-10 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                            <input
                                type="file"
                                required
                                accept="image/*,.pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-14 h-14 bg-[#006a4e]/10 rounded-full flex items-center justify-center text-[#006a4e] mb-3">
                                <Upload size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 max-w-[90%] truncate text-center">
                                {file ? file.name : 'Choose file or drag & drop here'}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 font-semibold">Accepted formats: JPG, PNG, PDF (Max 10MB)</span>
                        </div>
                    </div>

                    {/* Patient Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-800">Patient Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Enter patient full name"
                            className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                        />
                    </div>

                    {/* Contact Phone */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-800">Mobile Number <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 03001234567"
                            className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-800">Additional Instructions (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="List specific medicines or dosages from the prescription, or any other notes for the pharmacist."
                            rows={4}
                            className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !file || !patientName || !phone}
                        className={`w-full font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all text-sm ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white cursor-pointer'}`}
                    >
                        {loading ? "Uploading..." : "Submit Prescription"}
                    </button>
                </form>

                {/* Right Side: Quality Guideline Checklist */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 pb-4 border-b border-slate-100">
                            <ClipboardList size={20} className="text-[#006a4e]" />
                            Prescription Guidelines
                        </h3>

                        <ul className="space-y-4 text-xs font-semibold text-slate-500">
                            <li className="flex items-start gap-3">
                                <span className="bg-[#006a4e]/10 text-[#006a4e] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                                <p className="leading-relaxed">The image must clearly display the doctor's name, degree, license number, and signature stamp.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-[#006a4e]/10 text-[#006a4e] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                                <p className="leading-relaxed">Patient name and date of prescription should be legible and recent.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-[#006a4e]/10 text-[#006a4e] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                                <p className="leading-relaxed">Names of specific tablets, syrups, or capsules must not be covered or cropped out.</p>
                            </li>
                        </ul>

                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs leading-relaxed font-semibold">
                            <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <p>
                                Regulatory Warning: We do not dispense narcotics, psychoactive substances, or emergency hormonal drugs without manual verification of an authorized doctor prescription.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
