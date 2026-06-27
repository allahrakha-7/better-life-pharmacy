import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBasket, ChevronDown, X, ShieldAlert, Heart, MapPin, Phone, CheckCircle, AlertCircle, LogOut, Settings, User } from 'lucide-react';
import headerLogo from '../assets/images/header_logo.png';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { medicineService } from '../services/medicineService';
import { authService } from '../services/authService';

export default function Navbar({ onNavigate }) {
    // -------------------------------------------------------------
    // States & Refs
    // -------------------------------------------------------------
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    // Profile updates states
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [allergies, setAllergies] = useState('');
    const [saving, setSaving] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [updateError, setUpdateError] = useState('');

    const { cartCount } = useCart();
    const { user, login, logout } = useAuth();

    const categoryRef = useRef(null);
    const searchRef = useRef(null);
    const profileRef = useRef(null);

    // Fetch profile info on load
    useEffect(() => {
        if (user) {
            authService.getProfile()
                .then(profile => {
                    setName(profile.name || user.name || '');
                    setPhone(profile.phone || '');
                    setShippingAddress(profile.shippingAddress || '');
                    setAllergies(profile.allergies || '');
                })
                .catch(err => console.error("Failed to load user profile:", err));
        }
    }, [user]);


    // -------------------------------------------------------------
    // Dropdown options data
    // -------------------------------------------------------------
    const categories = [
        'Prescription Medicines',
        'OTC Medicines',
        'Baby & Mother Care',
        'Personal Care',
        'Wellness & Supplements',
        'Medical Devices & Surgical',
        'Herbals & Organics',
        'Homeopathy'
    ];

    // -------------------------------------------------------------
    // Click Outside Listener & Suggestions Fetcher
    // -------------------------------------------------------------
    useEffect(() => {
        function handleClickOutside(event) {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setCategoryOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchSuggestionsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) return;

        const delayDebounce = setTimeout(async () => {
            try {
                const data = await medicineService.getMedicines({ search: searchQuery });
                setSuggestions(data.slice(0, 6));
            } catch (err) {
                console.error("Failed to load search suggestions:", err);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <>
            <nav className="w-full bg-white backdrop-blur-sm border border-white/20 rounded-2xl py-2.5 px-5 md:px-7 flex items-center justify-between shadow-lg relative z-50 transition-all duration-300">

                {/* 1. Logo & Brand Name */}
                <div className="flex items-center gap-1.5 cursor-pointer shrink-0" onClick={() => onNavigate && onNavigate('home')}>
                    <img src={headerLogo} alt="Better Life Logo" className="w-10 h-10 object-contain" />
                    <span className="text-base md:text-xl font-bold text-[#004d38] tracking-tight hidden sm:block">
                        Better Life
                    </span>
                </div>

                {/* 2. Categories Dropdown */}
                <div ref={categoryRef} className="relative hidden lg:block ml-6 shrink-0">
                    <button
                        onClick={() => setCategoryOpen(!categoryOpen)}
                        className="flex items-center gap-1.5 text-slate-700 hover:text-[#006a4e] text-sm font-semibold transition-colors duration-200 cursor-pointer select-none"
                    >
                        All Categories
                        <ChevronDown size={16} className={`transition-transform duration-250 ${categoryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {categoryOpen && (
                        <div className="absolute top-full left-0 mt-3.5 w-64 bg-white/95 backdrop-blur-md border border-slate-200/40 rounded-2xl shadow-xl py-2.5 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1">
                            {categories.map((category, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCategoryOpen(false);
                                        if (onNavigate) onNavigate('medicines');
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-[#006a4e]/10 hover:text-[#006a4e] rounded-xl transition-all duration-150 flex items-center font-medium cursor-pointer"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Search Bar */}
                <div ref={searchRef} className="flex-1 max-w-[20rem] md:max-w-md mx-2 md:mx-4 relative">
                    <div className="bg-white border border-[#e2e8f0] rounded-2xl flex items-center px-3 md:px-4 py-2 shadow-sm hover:border-[#006a4e] focus-within:border-[#006a4e] focus-within:ring-2 focus-within:ring-[#006a4e]/10 transition-all duration-200">
                        <Search size={16} className="text-slate-400 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (!val.trim()) {
                                    setSuggestions([]);
                                }
                                setSearchSuggestionsOpen(true);
                            }}
                            onFocus={() => setSearchSuggestionsOpen(true)}
                            placeholder="Search medicines..."
                            className="w-full bg-transparent border-none outline-none pl-1.5 md:pl-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-slate-100 rounded-full">
                                <X size={14} className="text-slate-400 hover:text-slate-600" />
                            </button>
                        )}
                    </div>

                    {searchSuggestionsOpen && searchQuery.trim() !== '' && (
                        <div className="absolute top-full left-0 right-0 mt-3.5 bg-white/95 backdrop-blur-md border border-slate-200/40 rounded-2xl shadow-xl py-2.5 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-76 overflow-y-auto space-y-1">
                            {suggestions.length > 0 ? (
                                suggestions.map((item) => (
                                    <button
                                        key={item._id}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSearchSuggestionsOpen(false);
                                            if (onNavigate) onNavigate('detail', item._id);
                                        }}
                                        className="w-full text-left px-3.5 py-2.5 text-xs md:text-sm text-slate-700 hover:bg-[#006a4e]/10 hover:text-[#006a4e] rounded-xl transition-all duration-150 flex items-center gap-2.5 font-medium cursor-pointer"
                                    >
                                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <span className="block font-bold text-slate-800 text-xs truncate">{item.name}</span>
                                            <span className="block text-[10px] text-slate-400 font-semibold uppercase">{item.brand}</span>
                                        </div>
                                        <span className="text-xs font-bold text-[#006a4e] shrink-0">Rs. {item.price}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-xs md:text-sm text-slate-500 text-center">
                                    No items found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Group: Shopping Basket & Auth */}
                <div className="flex items-center gap-4 shrink-0 ml-3">
                    {/* Shopping Basket */}
                    <div className="relative top-1">
                        <button
                            onClick={() => {
                                if (onNavigate) onNavigate('cart');
                            }}
                            className="relative p-2 text-slate-600 hover:text-[#006a4e] hover:bg-slate-100/60 rounded-full cursor-pointer transition-all duration-200"
                        >
                            <ShoppingBasket size={30} />
                            <span className="absolute -top-0.5 -right-0.5 bg-[#006a4e] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#f4f7f6]">
                                {cartCount}
                            </span>
                        </button>
                    </div>

                    {/* Admin link helper */}
                    {user && (user.role === 'admin' || user.isAdmin) && (
                        <button
                            onClick={() => onNavigate && onNavigate('admin')}
                            className="hidden lg:flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-full transition-colors shrink-0"
                        >
                            <ShieldAlert size={14} />
                            <span>Admin</span>
                        </button>
                    )}

                    {/* Auth Link (Sign In / Profile Dropdown) */}
                    {user ? (
                        <div ref={profileRef} className="relative">
                            {/* Circular Avatar Trigger */}
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="w-10 h-10 rounded-full bg-[#006a4e] text-white flex items-center justify-center font-extrabold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all select-none uppercase cursor-pointer border border-[#006a4e]/20"
                                title="Manage Profile"
                            >
                                {user.name ? user.name.charAt(0) : 'U'}
                            </button>

                            {/* Premium Dropdown Menu containing 2 Buttons */}
                            {profileMenuOpen && (
                                <div className="absolute top-full right-0 mt-3 w-60 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 z-[100] animate-in fade-in slide-in-from-top-3 duration-250 space-y-3.5 text-slate-700">
                                    {/* Header: User Info */}
                                    <div className="border-b border-slate-100 pb-2.5">
                                        <h4 className="text-xs font-bold text-slate-800 truncate">{user.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-semibold truncate">{user.email}</p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {/* Button 1: Update Profile */}
                                        <button
                                            onClick={() => {
                                                setName(user.name || '');
                                                setPhone(user.phone || '');
                                                setShippingAddress(user.shippingAddress || '');
                                                setAllergies(user.allergies || '');
                                                setUpdateSuccess('');
                                                setUpdateError('');
                                                setProfileMenuOpen(false);
                                                setProfileModalOpen(true);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-left font-bold text-[#006a4e] bg-[#006a4e]/5 hover:bg-[#006a4e]/10 rounded-2xl transition-all cursor-pointer"
                                        >
                                            <Settings size={15} />
                                            <span>Update Profile</span>
                                        </button>

                                        {/* Button 2: Sign Out */}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setProfileMenuOpen(false);
                                                if (onNavigate) onNavigate('home');
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-left font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
                                        >
                                            <LogOut size={15} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => onNavigate && onNavigate('login')}
                            className="hidden sm:block text-slate-700 hover:text-[#006a4e] text-xs md:text-sm font-bold transition-colors cursor-pointer select-none shrink-0"
                        >
                            Sign In
                        </button>
                    )}
                </div>

            </nav>

            {/* Health Profile Update Modal Overlay */}
            {profileModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl w-full max-w-md p-7 md:p-9 relative animate-in zoom-in-95 duration-200 text-slate-700">
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setProfileModalOpen(false);
                                setUpdateSuccess('');
                                setUpdateError('');
                            }}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        {/* Title */}
                        <div className="mb-6">
                            <h3 className="text-lg md:text-xl font-bold text-[#004d38] tracking-tight">
                                Profile
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                Keep your medical and delivery information up to date.
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setSaving(true);
                                setUpdateSuccess('');
                                setUpdateError('');
                                try {
                                    await authService.updateProfile({ name, phone, shippingAddress, allergies });
                                    setUpdateSuccess('Profile updated successfully!');
                                    login({
                                        ...user,
                                        name,
                                        phone,
                                        shippingAddress,
                                        allergies
                                    });
                                } catch (err) {
                                    console.error(err);
                                    setUpdateError(err.response?.data?.message || err.message || 'Failed to save health profile.');
                                } finally {
                                    setSaving(false);
                                }
                            }}
                            className="space-y-4"
                        >
                            {/* Success Banner */}
                            {updateSuccess && (
                                <div className="bg-emerald-50 text-emerald-600 text-xs font-bold rounded-2xl p-3 flex items-center gap-2 border border-emerald-100 animate-in slide-in-from-top-2">
                                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                    <span>{updateSuccess}</span>
                                </div>
                            )}

                            {/* Error Banner */}
                            {updateError && (
                                <div className="bg-red-50 text-red-600 text-xs font-bold rounded-2xl p-3 flex items-center gap-2 border border-red-100 animate-in slide-in-from-top-2">
                                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                                    <span>{updateError}</span>
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <User size={11} className="text-[#006a4e]" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006a4e]/40 focus:bg-white transition-all font-medium"
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Phone size={11} className="text-[#006a4e]" /> Contact Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 03001234567"
                                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006a4e]/40 focus:bg-white transition-all font-medium"
                                />
                            </div>

                            {/* Delivery Address */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <MapPin size={11} className="text-[#006a4e]" /> Delivery Address
                                </label>
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    rows="3"
                                    placeholder="Enter your complete home or work address for deliveries"
                                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006a4e]/40 focus:bg-white transition-all resize-none font-medium"
                                />
                            </div>

                            {/* Allergies / Chronic Conditions */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Heart size={11} className="text-[#006a4e]" /> Allergies & Conditions
                                </label>
                                <input
                                    type="text"
                                    value={allergies}
                                    onChange={(e) => setAllergies(e.target.value)}
                                    placeholder="e.g. Penicillin, Lactose intolerant, Asthma"
                                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006a4e]/40 focus:bg-white transition-all font-medium"
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-[#006a4e] hover:bg-[#00543e] disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-xs md:text-sm transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center gap-2"
                            >
                                {saving ? 'Saving changes...' : 'Save Profile Details'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
