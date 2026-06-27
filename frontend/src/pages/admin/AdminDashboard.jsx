import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileSpreadsheet, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, XCircle, LogOut } from 'lucide-react';
import { medicineService } from '../../services/medicineService';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard({ onNavigate }) {
    const { logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        const fetchDashboardData = async () => {
            try {
                const [ordersData, medicinesData] = await Promise.all([
                    medicineService.getAllOrders(),
                    medicineService.getMedicines()
                ]);
                if (active) {
                    setOrders(ordersData);
                    setMedicines(medicinesData);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load admin dashboard data:", err);
                if (active) {
                    setError("Unauthorized or failed to load store metrics.");
                    setLoading(false);
                }
            }
        };
        fetchDashboardData();
        return () => { active = false; };
    }, []);

    const handleLogout = () => {
        logout();
        onNavigate('home');
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            await medicineService.updateOrderStatus(id, newStatus);
            // Refresh local state
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Error updating order status.");
        }
    };

    // Calculate metrics
    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

    const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length;
    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
    const lowStockCount = medicines.filter(m => (m.stock !== undefined && m.stock < 10) || m.stock === 0).length;

    if (loading) {
        return (
            <div className="py-24 text-center max-w-7xl mx-auto px-6 text-slate-500 font-bold">
                <span className="animate-pulse">Loading dashboard metrics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-60 text-center max-w-7xl mx-auto px-6 space-y-4">
                <h3 className="font-extrabold text-2xl text-slate-800">Access Denied</h3>
                <p className="text-red-500 text-xs md:text-sm font-semibold">{error}</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => onNavigate('login')}
                        className="bg-[#006a4e] text-white px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer shadow-md"
                    >
                        Login as Admin
                    </button>
                    <button
                        onClick={() => onNavigate('home')}
                        className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer border border-slate-200"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <span className="text-xs font-bold text-[#006a4e] uppercase tracking-wider">Store Management</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-1">Admin Dashboard</h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-1">Monitor pharmacy sales, handle prescription approvals, and control inventory.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => onNavigate('admin-inventory')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200"
                    >
                        Manage Inventory <ArrowRight size={14} />
                    </button>
                    <button
                        onClick={() => onNavigate('admin-prescriptions')}
                        className="bg-[#006a4e] hover:bg-[#00543e] text-white font-bold py-2.5 px-5 rounded-full text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        Verify Prescriptions <ArrowRight size={14} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-red-100"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Metric 1 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-50 text-[#006a4e] rounded-2xl flex items-center justify-center shrink-0">
                        <LayoutDashboard size={22} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">Total Revenue</span>
                        <span className="text-xl md:text-2xl font-black text-slate-800">Rs. {totalRevenue.toLocaleString()}</span>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                        <Users size={22} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">Active Orders</span>
                        <span className="text-xl md:text-2xl font-black text-slate-800">{activeOrdersCount}</span>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                        <FileSpreadsheet size={22} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">Pending Review</span>
                        <span className="text-xl md:text-2xl font-black text-slate-800">{pendingOrdersCount}</span>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">Low Stock Items</span>
                        <span className="text-xl md:text-2xl font-black text-slate-800">{lowStockCount}</span>
                    </div>
                </div>

            </div>

            {/* Recent Orders Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-4 mb-6">Recent Pharmacy Orders</h3>

                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs md:text-sm font-semibold">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                                    <th className="pb-4 pr-4">Order ID</th>
                                    <th className="pb-4 pr-4">Customer</th>
                                    <th className="pb-4 pr-4">Date</th>
                                    <th className="pb-4 pr-4">Amount</th>
                                    <th className="pb-4 pr-4">Status</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-600">
                                {orders.map((o) => (
                                    <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 pr-4 font-bold text-slate-800 select-all">{o.orderId}</td>
                                        <td className="py-4 pr-4">{o.name}</td>
                                        <td className="py-4 pr-4 text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4 pr-4 font-bold text-slate-800">Rs. {o.total}</td>
                                        <td className="py-4 pr-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${o.status === 'delivered' ? 'bg-emerald-50 text-[#006a4e]' :
                                                o.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                                                    o.status === 'pending' ? 'bg-amber-50 text-amber-600 animate-pulse' :
                                                        o.status === 'processing' ? 'bg-indigo-50 text-indigo-600' :
                                                            'bg-red-50 text-red-600'
                                                }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right flex justify-end gap-2">
                                            {o.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateOrderStatus(o._id, 'processing')}
                                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full cursor-pointer transition-colors"
                                                        title="Process Order"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateOrderStatus(o._id, 'cancelled')}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full cursor-pointer transition-colors"
                                                        title="Cancel Order"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {o.status === 'processing' && (
                                                <button
                                                    onClick={() => updateOrderStatus(o._id, 'shipped')}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer transition-colors animate-pulse"
                                                    title="Mark as Shipped"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            )}
                                            {o.status === 'shipped' && (
                                                <button
                                                    onClick={() => updateOrderStatus(o._id, 'delivered')}
                                                    className="p-1.5 text-[#006a4e] hover:bg-emerald-50 rounded-full cursor-pointer transition-colors"
                                                    title="Mark as Delivered"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            )}
                                            <span
                                                className="text-xs font-bold text-[#006a4e] hover:text-[#00543e] cursor-pointer self-center ml-2"
                                                onClick={() => {
                                                    // Navigate to detail or search track-order
                                                    onNavigate('track-order');
                                                }}
                                            >
                                                Track
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-slate-400">No orders placed yet.</div>
                )}
            </div>

            <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold">
                <ShieldCheck size={14} className="text-[#006a4e]" />
                <span>Authorized Pharmacist Access Only</span>
            </div>
        </div>
    );
}
