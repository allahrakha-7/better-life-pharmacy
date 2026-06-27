import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Eye, ShieldCheck, FileText } from 'lucide-react';
import { medicineService } from '../../services/medicineService';

export default function VerifyPrescriptions({ onNavigate }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        const fetchPrescriptions = async () => {
            try {
                const data = await medicineService.getAllPrescriptions();
                if (active) {
                    setPrescriptions(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to fetch prescriptions:", err);
                if (active) {
                    setError("Failed to fetch prescriptions. Please make sure you are logged in as an admin.");
                    setLoading(false);
                }
            }
        };
        fetchPrescriptions();
        return () => { active = false; };
    }, []);

    const handleAction = async (id, newStatus) => {
        try {
            await medicineService.verifyPrescription(id, newStatus);
            setPrescriptions(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
        } catch (err) {
            console.error("Failed to verify prescription:", err);
            alert("Error updating prescription status.");
        }
    };

    const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending Verification' || p.status === 'pending');

    if (loading) {
        return (
            <div className="py-24 text-center max-w-7xl mx-auto px-6 text-slate-500 font-bold">
                <span className="animate-pulse">Loading prescriptions...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <button
                    onClick={() => onNavigate('admin')}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#006a4e] hover:text-[#00543e] cursor-pointer mb-2"
                >
                    <ArrowLeft size={16} /> Return to Dashboard
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Verify Prescriptions</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Review prescriptions submitted by patients. Approve to release order or reject if illegible.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-2xl text-xs md:text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Main Prescriptions List */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-4">Pending Approvals</h3>

                <div className="grid grid-cols-1 gap-6">
                    {pendingPrescriptions.length > 0 ? (
                        pendingPrescriptions.map((p) => {
                            const hostname = window.location.hostname;
                            const imageSrc = p.fileUrl
                                ? (p.fileUrl.startsWith('http') ? p.fileUrl : `http://${hostname}:5000${p.fileUrl}`)
                                : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80';

                            return (
                                <div key={p._id} className="border border-slate-100 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center hover:shadow-md transition-shadow">

                                    {/* Info details */}
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-400 font-mono select-all">ID: {p._id}</span>
                                            <span className="bg-amber-50 text-amber-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                                                {p.status}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 text-base md:text-lg">{p.patientName}</h4>
                                            <span className="text-xs font-bold text-slate-400">{p.phone} &bull; Uploaded {new Date(p.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {p.notes && (
                                            <div className="bg-slate-50 rounded-2xl p-4 text-xs font-semibold text-slate-500 leading-relaxed max-w-2xl flex gap-2">
                                                <FileText size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                                <p>{p.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview and Actions */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto justify-end">
                                        {/* Small image preview container */}
                                        <div
                                            onClick={() => setSelectedImg(imageSrc)}
                                            className="relative w-28 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 cursor-zoom-in group shrink-0"
                                        >
                                            <img src={imageSrc} alt="Prescription" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                                <Eye size={16} />
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleAction(p._id, 'approved')}
                                                className="flex-1 sm:flex-initial bg-[#006a4e] hover:bg-[#00543e] active:scale-95 text-white font-bold py-2.5 px-5 rounded-full text-xs md:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <Check size={16} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(p._id, 'rejected')}
                                                className="flex-1 sm:flex-initial bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-5 rounded-full text-xs md:text-sm transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <X size={16} /> Reject
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    ) : (
                        <div className="py-16 text-center text-slate-400 space-y-3">
                            <span className="text-4xl">🎉</span>
                            <h4 className="font-bold text-slate-700 text-lg">All caught up!</h4>
                            <p className="text-xs max-w-xs mx-auto leading-relaxed">No pending prescriptions require pharmacist verification right now.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Image zoom-in view */}
            {selectedImg && (
                <div
                    onClick={() => setSelectedImg(null)}
                    className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
                >
                    <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedImg(null)}
                            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md z-10 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <img src={selectedImg} alt="Enlarged Prescription" className="max-w-full max-h-[80vh] object-contain rounded-2xl" />
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold">
                <ShieldCheck size={14} className="text-[#006a4e]" />
                <span>Regulatory standards require double check of doctor license and patient name</span>
            </div>
        </div>
    );
}
