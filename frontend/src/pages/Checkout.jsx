import { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { medicineService } from '../services/medicineService';

export default function Checkout({ onNavigate }) {
    const { cartItems, cartSubtotal, clearCart } = useCart();
    const subtotal = cartSubtotal;
    const shipping = subtotal > 1000 ? 0 : 150;
    const discount = subtotal > 500 ? 50 : 0;
    const total = Math.max(0, subtotal - discount + shipping);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('Lahore');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isPlaced, setIsPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();
        if (!name || !phone || !address || cartItems.length === 0) return;

        setLoading(true);
        setError(null);

        const orderData = {
            name,
            phone,
            address,
            city,
            paymentMethod,
            items: cartItems.map(item => ({
                medicine: item._id || item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal,
            shipping,
            total
        };

        try {
            const res = await medicineService.createOrder(orderData);
            setOrderNumber(res.orderId || `BLP-${Date.now()}`);
            setIsPlaced(true);
            clearCart();
        } catch (err) {
            console.error("Order submission failed:", err);
            setError(err.message || "Something went wrong while placing your order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isPlaced) {
        return (
            <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-8 animate-fade-in">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#006a4e] animate-bounce">
                    <CheckCircle2 size={48} />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-extrabold text-slate-800">Order Placed Successfully!</h2>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Thank you for choosing Better Life Pharmacy. Your order is being packed and will be shipped to <span className="font-bold text-slate-800">{city}</span>.
                    </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-left space-y-4 max-w-md mx-auto">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>ORDER ID</span>
                        <span>SHIPPING VIA</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                        <span className="font-extrabold text-slate-800 text-base">{orderNumber}</span>
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <Truck size={14} /> Express Delivery
                        </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Delivery Address:</span>
                        <span className="text-slate-800 text-right font-medium max-w-[200px] truncate">{address}</span>
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
                        onClick={() => onNavigate('track-order')}
                        className="flex-1 bg-[#006a4e] hover:bg-[#00543e] text-white font-bold py-3.5 px-6 rounded-full text-sm shadow-md transition-all cursor-pointer"
                    >
                        Track Order
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 space-y-8">
            {/* Header */}
            <div>
                <button
                    onClick={() => onNavigate('cart')}
                    className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#006a4e] hover:text-[#00543e] cursor-pointer mb-2"
                >
                    <ArrowLeft size={16} /> Return to Basket
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Checkout</h1>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-2xl text-xs md:text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left side Form */}
                <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-6">
                    <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-3">Delivery Information</h3>

                    {/* Customer Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-800">Full Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter full name"
                            className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-800">Phone Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. 03001234567"
                                className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-800">Email Address (Optional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                            />
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-800">Shipping Address <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street address, apartment, house number, area"
                            className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                        />
                    </div>

                    {/* City Select */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-800">City <span className="text-red-500">*</span></label>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium appearance-none cursor-pointer"
                        >
                            <option value="Lahore">Lahore</option>
                            <option value="Karachi">Karachi</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Faisalabad">Faisalabad</option>
                            <option value="Rawalpindi">Rawalpindi</option>
                        </select>
                    </div>

                    {/* Payment Option Selection */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-800">Payment Option</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => setPaymentMethod('cod')}
                                className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#006a4e] bg-[#006a4e]/5' : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Truck className={`text-xl ${paymentMethod === 'cod' ? 'text-[#006a4e]' : 'text-slate-500'}`} />
                                    <div>
                                        <span className="block text-xs md:text-sm font-bold text-slate-800">Cash on Delivery</span>
                                        <span className="text-[10px] text-slate-400 font-semibold">Pay with cash upon delivery</span>
                                    </div>
                                </div>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#006a4e]' : 'border-slate-300'}`}>
                                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#006a4e]" />}
                                </div>
                            </div>

                            <div
                                onClick={() => setPaymentMethod('card')}
                                className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#006a4e] bg-[#006a4e]/5' : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <CreditCard className={`text-xl ${paymentMethod === 'card' ? 'text-[#006a4e]' : 'text-slate-500'}`} />
                                    <div>
                                        <span className="block text-xs md:text-sm font-bold text-slate-800">Credit / Debit Card</span>
                                        <span className="text-[10px] text-slate-400 font-semibold">Visa, Mastercard, PayPak</span>
                                    </div>
                                </div>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#006a4e]' : 'border-slate-300'}`}>
                                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#006a4e]" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Right side summary panel */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
                        <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-3">Billing summary</h3>

                        <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
                            {cartItems.map((item) => {
                                const itemId = item._id || item.id;
                                return (
                                    <div key={itemId} className="flex justify-between items-center text-xs text-slate-600 font-medium">
                                        <span className="truncate max-w-[200px]">{item.name} <strong className="text-slate-800">x{item.quantity}</strong></span>
                                        <span className="font-bold text-slate-800">Rs. {item.price * item.quantity}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-3.5 text-xs md:text-sm font-semibold text-slate-500 border-t border-slate-100 pt-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-slate-800">Rs. {subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Fee</span>
                                <span className="text-slate-800">Rs. {shipping}</span>
                            </div>
                            <div className="flex justify-between pb-4 border-b border-slate-100">
                                <span>Tax (GST)</span>
                                <span className="text-slate-800">Rs. 0</span>
                            </div>
                            <div className="flex justify-between items-end text-sm md:text-base font-extrabold pt-2">
                                <span className="text-slate-800">Grand Total</span>
                                <span className="text-xl font-black text-[#006a4e]">Rs. {total}</span>
                            </div>
                        </div>

                        {/* Complete Order button */}
                        <button
                            onClick={handlePlaceOrder}
                            disabled={!name || !phone || !address || cartItems.length === 0 || loading}
                            className={`w-full font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all text-sm ${(!name || !phone || !address || cartItems.length === 0 || loading) ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white cursor-pointer'}`}
                        >
                            {loading ? "Placing Order..." : `Place Order (${paymentMethod.toUpperCase()})`}
                            <CheckCircle2 size={18} />
                        </button>

                        <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold pt-2">
                            <ShieldCheck size={14} className="text-[#006a4e]" />
                            <span>100% Secure Checkout Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
