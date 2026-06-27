import { useState, useEffect } from 'react';
import { ShoppingBasket, Trash2, ShieldCheck, ArrowLeft, ArrowRight, Upload, CheckCircle, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { medicineService } from '../services/medicineService';

export default function Cart({ onNavigate }) {
    const { cartItems, addToCart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
    const [prescriptionFile, setPrescriptionFile] = useState(null);

    const [medicines, setMedicines] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(() => {
        const local = localStorage.getItem('wishlist');
        return local ? JSON.parse(local) : [];
    });

    useEffect(() => {
        let active = true;
        const loadMedicines = async () => {
            try {
                const data = await medicineService.getMedicines();
                if (active) {
                    setMedicines(data);
                }
            } catch (err) {
                console.error("Failed to load medicines:", err);
            }
        };
        loadMedicines();
        return () => { active = false; };
    }, []);

    const wishlistItems = medicines.filter(prod => {
        const prodId = prod._id || prod.id;
        return wishlistIds.includes(prodId);
    });

    const removeWishlistItem = (id) => {
        const updated = wishlistIds.filter(itemId => itemId !== id);
        setWishlistIds(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
    };

    const handleWishlistAction = (prod, isAdded) => {
        const prodId = prod._id || prod.id;
        if (isAdded) {
            removeFromCart(prodId);
        } else {
            addToCart(prod, 1);
        }
    };

    const updateQty = (id, change) => {
        const item = cartItems.find(item => item._id === id || item.id === id);
        if (!item) return;
        const targetId = item._id || item.id;
        updateQuantity(targetId, item.quantity + change);
    };

    const removeItem = (id) => {
        removeFromCart(id);
    };

    const subtotal = cartSubtotal;
    const shipping = subtotal > 1000 ? 0 : 150;
    const discount = subtotal > 500 ? 50 : 0;
    const total = Math.max(0, subtotal - discount + shipping);

    const hasPrescriptionMedicine = cartItems.some(item => item.prescriptionRequired);

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 space-y-8">
            {/* Header section */}
            <div>
                <button
                    onClick={() => onNavigate('medicines')}
                    className="flex items-center gap-1 text-xs md:text-sm font-bold text-[#006a4e] hover:text-[#00543e] cursor-pointer mb-2"
                >
                    <ArrowLeft size={16} /> Continue Shopping
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Your Shopping Basket</h1>
            </div>

            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* 1. Left Side: Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm divide-y divide-slate-100">
                            {cartItems.map((item) => {
                                const itemId = item._id || item.id;
                                return (
                                    <div key={itemId} className="py-5 flex flex-col sm:flex-row gap-4 md:gap-6 first:pt-0 last:pb-0 sm:items-center justify-between">
                                        <div className="flex gap-4 items-center flex-1">
                                            {/* Product image */}
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <span className="text-[10px] font-bold text-[#006a4e] uppercase">{item.brand}</span>
                                                <h4 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1">{item.name}</h4>
                                                <span className="text-xs md:text-sm font-semibold text-slate-500 block">Rs. {item.price} each</span>
                                            </div>
                                        </div>

                                        {/* Count / Remove actions */}
                                        <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t border-slate-50 sm:border-t-0">
                                            {/* Qty controls */}
                                            <div className="flex items-center border border-slate-200 rounded-full bg-slate-50">
                                                <button
                                                    onClick={() => updateQty(itemId, -1)}
                                                    className="px-3 py-1.5 font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold text-xs md:text-sm text-slate-800 w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQty(itemId, 1)}
                                                    className="px-3 py-1.5 font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Total price */}
                                            <span className="text-sm md:text-base font-bold text-slate-800 w-20 text-right">
                                                Rs. {item.price * item.quantity}
                                            </span>

                                            {/* Remove button */}
                                            <button
                                                onClick={() => removeItem(itemId)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Prescription Upload Card if required */}
                        {hasPrescriptionMedicine && (
                            <div className="bg-white border border-dashed border-[#006a4e]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                                <div className="flex gap-3 text-slate-800">
                                    <CheckCircle size={22} className="text-[#006a4e] shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-sm md:text-base">Upload Doctor Prescription Required</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                            One or more medicines in your cart require a medical prescription. Please upload an image/PDF file of your prescription to process the order.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl py-6 bg-slate-50/50 hover:bg-slate-50 transition-colors relative cursor-pointer">
                                    <input
                                        type="file"
                                        onChange={(e) => setPrescriptionFile(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload size={24} className="text-[#006a4e] mb-2" />
                                    <span className="text-xs font-bold text-slate-700">
                                        {prescriptionFile ? prescriptionFile.name : 'Choose file or drag here'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 mt-1 font-semibold">JPG, PNG or PDF (Max 5MB)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Right Side: Order Summary */}
                    <div className="space-y-6 sticky top-24">
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 text-lg pb-4 border-b border-slate-100">Order Summary</h3>

                            <div className="space-y-3.5 text-xs md:text-sm font-semibold text-slate-500">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-slate-800">Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Special Discount</span>
                                    <span className="text-red-500">- Rs. {discount}</span>
                                </div>
                                <div className="flex justify-between pb-4 border-b border-slate-100">
                                    <span>Delivery Charge</span>
                                    <span className="text-slate-800">{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
                                </div>
                                <div className="flex justify-between items-end text-sm md:text-base font-extrabold pt-2">
                                    <span className="text-slate-800">Total Price</span>
                                    <span className="text-2xl font-black text-[#006a4e]">Rs. {total}</span>
                                </div>
                            </div>

                            {/* Promo Code Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Coupon Code"
                                    className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                                />
                                <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-full text-xs transition-colors cursor-pointer">
                                    Apply
                                </button>
                            </div>

                            {/* Checkout button */}
                            <button
                                onClick={() => onNavigate('checkout')}
                                className="w-full bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-sm"
                            >
                                Proceed to Checkout
                                <ArrowRight size={18} />
                            </button>

                            <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold justify-center pt-2">
                                <ShieldCheck size={14} className="text-[#006a4e]" />
                                <span>SSL Secure & Safe Payments</span>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] py-20 px-6 text-center shadow-sm max-w-xl mx-auto space-y-6">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-[#006a4e]">
                        <ShoppingBasket size={36} />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-bold text-slate-800 text-xl">Your basket is empty</h3>
                        <p className="text-xs md:text-sm text-slate-400 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet. Let's find some health supplies!</p>
                    </div>
                    <button
                        onClick={() => onNavigate('medicines')}
                        className="bg-[#006a4e] hover:bg-[#00543e] active:scale-95 text-white font-bold px-8 py-3 rounded-full text-sm shadow-md transition-all cursor-pointer"
                    >
                        Browse Medicines
                    </button>
                </div>
            )}

            {/* Wishlist Section */}
            <div className="pt-12 border-t border-slate-100/60 mt-12">
                <div className="flex items-center gap-2 mb-6">
                    <Heart className="text-[#006a4e] fill-[#006a4e]/10" size={24} />
                    <h2 className="text-2xl font-bold text-slate-800">Your Wishlist</h2>
                    <span className="text-xs font-bold bg-[#006a4e]/15 text-[#006a4e] px-2 py-0.5 rounded-full">
                        {wishlistItems.length}
                    </span>
                </div>
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((prod) => {
                            const prodId = prod._id || prod.id;
                            const isAdded = cartItems.some(item => (item._id === prodId || item.id === prodId));
                            return (
                                <div key={prodId} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative">
                                    <button
                                        onClick={() => removeWishlistItem(prodId)}
                                        className="absolute top-6 right-6 p-2 bg-white/85 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full border border-slate-100/50 shadow-sm transition-all cursor-pointer z-10"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div>
                                        <div className="rounded-2xl overflow-hidden bg-slate-50 relative aspect-[4/3] mb-4 flex items-center justify-center p-6 cursor-pointer" onClick={() => onNavigate('detail', prodId)}>
                                            <img src={prod.image} alt={prod.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wide">{prod.brand}</span>
                                            <h4 className="font-bold text-slate-800 text-xs md:text-sm line-clamp-1 hover:text-[#006a4e] cursor-pointer" onClick={() => onNavigate('detail', prodId)}>{prod.name}</h4>
                                            <span className="text-sm font-bold text-slate-800">Rs. {prod.price}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                                        <button
                                            onClick={() => handleWishlistAction(prod, isAdded)}
                                            className={`flex-1 font-bold py-2 rounded-xl text-xs transition-all cursor-pointer active:scale-95 ${isAdded
                                                ? 'bg-[#dffe5e] hover:bg-[#d4f54e] text-[#033126]'
                                                : 'bg-[#006a4e] hover:bg-[#00543e] text-white'
                                                }`}
                                        >
                                            {isAdded ? 'Added to Cart' : 'Move to Cart'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-100 rounded-3xl py-12 px-6 text-center shadow-sm max-w-sm mx-auto">
                        <span className="text-3xl">❤️</span>
                        <h4 className="font-bold text-slate-800 text-sm mt-3">Your wishlist is empty</h4>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">Items added to your wishlist will show up here so you can easily move them to your basket later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
