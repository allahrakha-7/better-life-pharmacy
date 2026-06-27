import { useState } from 'react';
import { ArrowLeft, Search, Package } from 'lucide-react';
import { medicineService } from '../services/medicineService';

export default function OrderTracking({ onNavigate }) {
    const [orderId, setOrderId] = useState('');
    const [trackedData, setTrackedData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        if (e) e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError('');
        setTrackedData(null);

        try {
            const order = await medicineService.trackOrder(orderId.trim());

            // Map backend status to steps
            const status = order.status; // pending, processing, shipped, delivered, cancelled
            const createdAt = order.createdAt;

            const steps = [
                {
                    title: 'Order Placed',
                    desc: 'Your order was verified and processed',
                    time: new Date(createdAt).toLocaleString(),
                    completed: true
                },
                {
                    title: 'Processing',
                    desc: 'Pharmacist is preparing your order',
                    time: status !== 'pending' ? 'Completed' : 'Pending',
                    completed: status !== 'pending' && status !== 'cancelled',
                    current: status === 'pending'
                },
                {
                    title: 'Shipped',
                    desc: 'Order left our central warehouse',
                    time: (status === 'shipped' || status === 'delivered') ? 'Completed' : 'Pending',
                    completed: status === 'shipped' || status === 'delivered',
                    current: status === 'processing'
                },
                {
                    title: 'Delivered',
                    desc: 'Order has been delivered to your address',
                    time: status === 'delivered' ? 'Completed' : 'Pending',
                    completed: status === 'delivered',
                    current: status === 'shipped'
                }
            ];

            if (status === 'cancelled') {
                steps.push({
                    title: 'Cancelled',
                    desc: 'Your order was cancelled',
                    time: 'Cancelled',
                    completed: true,
                    isCancelled: true
                });
            }

            setTrackedData({
                id: order.orderId,
                status: status.toUpperCase(),
                estDelivery: status === 'delivered' ? 'Delivered' : '1-2 Working Days',
                steps
            });
        } catch (err) {
            console.error("Tracking failed:", err);
            setError(err.message || 'Order ID not found. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 space-y-8">
            {/* Header */}
            <div>
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#006a4e] hover:text-[#00543e] cursor-pointer mb-2"
                >
                    <ArrowLeft size={16} /> Return to Home
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Track Your Order</h1>
                <p className="text-xs md:text-sm text-slate-400 mt-1 font-medium">Get real-time updates of your medicine delivery and order status.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Panel: Search Order */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-3">Find Order</h3>

                    <form onSubmit={handleTrack} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-800">Order ID or Reference Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="e.g. BLP-ORD-492102"
                                    className="w-full border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-bold"
                                />
                                <Search size={18} className="absolute left-4 top-4 text-slate-400" />
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl leading-relaxed">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !orderId.trim()}
                            className="w-full bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-xs md:text-sm"
                        >
                            {loading ? "Searching..." : "Track Status"}
                        </button>
                    </form>

                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs font-semibold text-slate-500 leading-relaxed">
                        <span className="block font-bold text-slate-700">Need Assistance?</span>
                        <p>If you did not receive a Reference/Order ID, please contact our 24/7 helpline at <span className="text-[#006a4e] font-extrabold">0800-BETTER-LIFE</span>.</p>
                    </div>
                </div>

                {/* Right Panel: Tracking Results */}
                <div className="lg:col-span-7">
                    {trackedData ? (
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-sm space-y-8 animate-fade-in">
                            {/* Summary row */}
                            <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-slate-100">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Tracking Order</span>
                                    <h4 className="font-extrabold text-slate-800 text-lg md:text-xl mt-0.5">{trackedData.id}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Estimated Delivery</span>
                                    <h4 className="font-extrabold text-[#006a4e] text-sm md:text-base mt-0.5">{trackedData.estDelivery}</h4>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="relative pl-8 space-y-8">
                                {/* Vertical line */}
                                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />

                                {trackedData.steps.map((step, idx) => (
                                    <div key={idx} className="relative flex gap-4 items-start">
                                        {/* Status Dot icon indicator */}
                                        <div className={`absolute -left-[29px] w-6 h-6 rounded-full border-4 flex items-center justify-center text-white shrink-0 ${step.isCancelled ? 'bg-red-500 border-red-50' : step.completed ? 'bg-[#006a4e] border-emerald-50' : step.current ? 'bg-amber-500 border-amber-50 animate-pulse' : 'bg-slate-200 border-white'}`}>
                                            {step.completed && <span className="text-[10px]">✓</span>}
                                        </div>

                                        <div className="space-y-1">
                                            <h5 className={`font-extrabold text-sm md:text-base ${step.isCancelled ? 'text-red-600' : step.completed ? 'text-slate-800' : step.current ? 'text-amber-600' : 'text-slate-400'}`}>
                                                {step.title}
                                            </h5>
                                            <p className={`text-xs ${step.completed || step.current ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {step.desc}
                                            </p>
                                            <span className="block text-[10px] font-bold text-slate-400 mt-1 uppercase">
                                                {step.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-slate-100/50 rounded-[2.5rem] py-20 px-6 text-center text-slate-400 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                                <Package size={28} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-700 text-lg">No tracking active</h4>
                                <p className="text-xs max-w-xs mx-auto leading-relaxed">Enter your Order ID in the left panel to fetch shipping info and see real-time updates.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
