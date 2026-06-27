import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { medicineService } from '../services/medicineService';

import personalCareImg from '../assets/images/personal-care.png';
import diabeticCareImg from '../assets/images/biabetic-care.png';
import supplementImg from '../assets/images/T_UP_Supplement.png';
import devicesImg from '../assets/images/devices.png';
import babyCareImg from '../assets/images/baby-care.png';
import hairCareImg from '../assets/images/hair-care.png';
import materalCareImg from '../assets/images/materal-care.png';
import meigreinTriggerImg from '../assets/images/meigrein-trigger.png';
import panadolImg from '../assets/images/panadol.png';
import surbexZImg from '../assets/images/surbex_z.png';
import arinacImg from '../assets/images/arcinic.png';
import enfamilImg from '../assets/images/emafil.png';
import napaImg from '../assets/images/napa.png';

const getProductImage = (prod) => {
    if (!prod) return '';

    // If image is a resolved asset or external URL, return it directly
    if (prod.image && (prod.image.startsWith('data:') || prod.image.startsWith('/') || prod.image.startsWith('http') || prod.image.includes('static/media') || prod.image.includes('assets/images/'))) {
        return prod.image;
    }

    const lowerName = (prod.name || '').toLowerCase();
    if (lowerName.includes('panadol') || lowerName.includes('alvedon')) return panadolImg;
    if (lowerName.includes('napa')) return napaImg;
    if (lowerName.includes('surbex')) return surbexZImg;
    if (lowerName.includes('arinac') || lowerName.includes('arcinic')) return arinacImg;
    if (lowerName.includes('enfamil') || lowerName.includes('emafil')) return enfamilImg;
    if (lowerName.includes('gluco') || lowerName.includes('diabetic')) return diabeticCareImg;
    return prod.image;
};

const renderPriceWithDiscount = (prod) => {
    if (!prod || !prod.price) return null;
    const priceStr = prod.price;
    const priceVal = typeof priceStr === 'string'
        ? parseFloat(priceStr.replace(/[^0-9.]/g, ''))
        : parseFloat(priceStr);

    if (isNaN(priceVal)) {
        return <span className="text-sm font-bold text-slate-800">Rs. {priceStr}</span>;
    }

    if (priceVal >= 1000) {
        const originalVal = Math.round(priceVal * 1.15); // 15% discount
        return (
            <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-800">Rs. {priceVal.toLocaleString()}</span>
                <span className="text-slate-400 line-through text-[11px] font-normal">Rs. {originalVal.toLocaleString()}</span>
            </div>
        );
    }

    return <span className="text-sm font-bold text-slate-800">Rs. {priceVal.toLocaleString()}</span>;
};

const renderDiscountBadge = (prod) => {
    if (prod.saveBadge) {
        return (
            <span className="absolute top-4 right-4 bg-[#dffe5e] text-[#033126] text-[10px] font-bold px-3 py-1 rounded-md shadow-sm">
                {prod.saveBadge}
            </span>
        );
    }

    const priceVal = typeof prod.price === 'string'
        ? parseFloat(prod.price.replace(/[^0-9.]/g, ''))
        : parseFloat(prod.price);

    if (!isNaN(priceVal) && priceVal >= 1000) {
        return (
            <span className="absolute top-4 right-4 bg-[#dffe5e] text-[#033126] text-[10px] font-bold px-3 py-1 rounded-md shadow-sm">
                15% OFF
            </span>
        );
    }

    return null;
};

const CATEGORIES = [
    { name: 'Personal Care', image: personalCareImg },
    { name: 'Diabetic Care', image: diabeticCareImg },
    { name: 'Supplement', image: supplementImg },
    { name: 'Devices', image: devicesImg },
    { name: 'Baby Care', image: babyCareImg },
    { name: 'Hair Care', image: hairCareImg }
];

const FEATURED_PRODUCTS = [
    { id: 1, name: 'Alvedon Forte® Bottle tablets 500 mg', price: 'Rs. 380', pieces: '25 pieces', saveBadge: 'Save Rs. 150', image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&auto=format&fit=crop&q=80' },
    { id: 2, name: 'GlucoLeader Enhance Blue Test Strip', price: 'Rs. 1,850', pieces: '1 pieces', saveBadge: 'Save Rs. 100', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Advanced ferity support for Fertility Supplement', price: 'Rs. 2,450', pieces: '1 pieces', saveBadge: '', image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&auto=format&fit=crop&q=80' },
    { id: 4, name: 'prenatal vitamins to baby esse-ntials Kindora', price: 'Rs. 2,850', pieces: '1 pieces', saveBadge: 'Save Rs. 200', image: 'https://images.unsplash.com/photo-1626863977501-831e5065c71d?w=400&auto=format&fit=crop&q=80' }
];

const RECENT_PRODUCTS = [
    { id: 1, name: 'Alvedon Forte® Bottle tablets 500 mg', price: 'Rs. 420', pieces: '25 pieces', saveBadge: 'Save Rs. 150', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Alvedon Forte® Bottle tablets 500 mg', price: 'Rs. 450', pieces: '25 pieces', saveBadge: '', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Omega-3 Fish Oil 1000 mg', price: 'Rs. 510', pieces: '25 pieces', saveBadge: '', image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Alvedon Forte® Bottle tablets 500 mg', price: 'Rs. 480', pieces: '25 pieces', saveBadge: '', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&auto=format&fit=crop&q=80' },
    { id: 5, name: 'Alvedon Forte® Bottle tablets 500 mg', price: 'Rs. 1,020', pieces: '25 pieces', saveBadge: 'Save Rs. 150', image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&auto=format&fit=crop&q=80' },
    { id: 6, name: 'Alvedon Forte® Bottle tablets 500 mg', price: 'Rs. 330', pieces: '25 pieces', saveBadge: '', image: 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=400&auto=format&fit=crop&q=80' },
    { id: 7, name: 'Loratadine ® Bottle tablets 500 mg', price: 'Rs. 390', pieces: '25 pieces', saveBadge: 'Save Rs. 150', image: 'https://images.unsplash.com/photo-1626863977501-831e5065c71d?w=400&auto=format&fit=crop&q=80' },
    { id: 8, name: 'Fertility Supplement Bottle tablets 300 mg', price: 'Rs. 360', pieces: '25 pieces', saveBadge: '', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80' }
];

const TESTIMONIALS = [
    {
        id: 1,
        title: 'Highly Reliable & Fast Delivery!',
        text: 'Better Life Pharmacy is a lifesaver! I ordered Panadol 500mg and got it delivered within 2 hours. Super fast delivery and 100% genuine medicine.',
        rating: '4.8',
        reviewsCount: '4,546',
        author: 'Neha P.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        productImage: panadolImg,
        type: 'product'
    },
    {
        id: 2,
        title: 'Authentic Supplements!',
        text: 'The healthcare supplements are absolutely genuine. I\'ve been taking Surbex-Z daily for immunity booster and energy, and the ordering process was extremely convenient.',
        rating: '4.9',
        reviewsCount: '4,906',
        author: 'Rahul D.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        productImage: surbexZImg,
        type: 'product'
    },
    {
        id: 3,
        title: 'Excellent & Quick Verification!',
        text: 'Excellent customer support! I uploaded my prescription for Arinac Forte, and the pharmacist verified it within minutes. Highly recommended pharmacy.',
        rating: '4.9',
        reviewsCount: '3,120',
        author: 'Ayesha K.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        productImage: arinacImg,
        type: 'product'
    },
    {
        id: 4,
        title: 'Genuine Baby Care Products!',
        text: 'Finding genuine Enfamil baby formula is always a struggle, but Better Life Pharmacy always has it in stock. Fast delivery and authentic baby products.',
        rating: '4.7',
        reviewsCount: '2,150',
        author: 'Zainab M.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        productImage: enfamilImg,
        type: 'product'
    },
    {
        id: 5,
        title: 'Superb Value & Service!',
        text: 'I regularly order Napa tablets for my grandparents. The pricing is very reasonable, and ordering online saves me so much hassle. Excellent service!',
        rating: '4.9',
        reviewsCount: '1,840',
        author: 'Hamza A.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        productImage: napaImg,
        type: 'product'
    }
];

export default function Home({ onNavigate }) {
    const { addToCart, removeFromCart, cartItems } = useCart();
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [medicines, setMedicines] = useState([]);

    // Wishlist state persisted in localStorage
    const [wishlist, setWishlist] = useState(() => {
        const local = localStorage.getItem('wishlist');
        return local ? JSON.parse(local) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (prod) => {
        const prodId = prod._id || prod.id;
        setWishlist(prev => {
            const exists = prev.some(id => id === prodId);
            if (exists) {
                return prev.filter(id => id !== prodId);
            }
            return [...prev, prodId];
        });
    };

    const isInWishlist = (prod) => {
        const prodId = prod._id || prod.id;
        return wishlist.includes(prodId);
    };

    const isInCart = (prod) => {
        const prodId = prod._id || prod.id;
        return cartItems?.some(item => (item._id === prodId || item.id === prodId)) || false;
    };

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const data = await medicineService.getMedicines();
                setMedicines(data);
            } catch (err) {
                console.error("Failed to load homepage medicines:", err);
            }
        };
        loadHomeData();
    }, []);

    const featured = medicines.length >= 4
        ? medicines.slice(0, 4)
        : FEATURED_PRODUCTS.map(p => ({ ...p, _id: p.id, price: 380, packageSize: p.pieces }));

    const recent = medicines.length >= 8
        ? medicines.slice(4, 12)
        : RECENT_PRODUCTS.map(p => ({ ...p, _id: p.id, price: 420, packageSize: p.pieces }));

    const handleNextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const currentTestimonial = TESTIMONIALS[activeTestimonial];
    const nextTestimonial = TESTIMONIALS[(activeTestimonial + 1) % TESTIMONIALS.length];

    return (
        <div className="space-y-16 pb-16">
            {/* Full-bleed Hero Component */}
            <Hero onNavigate={onNavigate} />

            {/* 1. Shop by Category Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Shop by Category</h2>
                    <button
                        onClick={() => onNavigate('medicines')}
                        className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#5c6a3e] hover:text-[#006a4e] cursor-pointer transition-colors"
                    >
                        View Category <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
                    {CATEGORIES.map((cat, idx) => (
                        <div
                            key={idx}
                            onClick={() => onNavigate('medicines')}
                            className="cursor-pointer group flex flex-col items-center"
                        >
                            {/* Category Card */}
                            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 relative">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="max-w-full max-h-full object-contain group-hover:scale-106 transition-transform duration-300"
                                />
                            </div>
                            {/* Label outside the card */}
                            <span className="mt-3.5 text-center text-sm font-semibold text-slate-700 group-hover:text-[#006a4e] transition-colors">
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Todays Best Deals Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Todays best deals</h2>
                    <button
                        onClick={() => onNavigate('medicines')}
                        className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#5c6a3e] hover:text-[#006a4e] cursor-pointer transition-colors"
                    >
                        View all <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {featured.map((prod) => (
                        <div
                            key={prod._id || prod.id}
                            className="cursor-pointer group flex flex-col justify-between"
                        >
                            {/* Card Box container */}
                            <div className="w-full aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center p-4 md:p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 relative" onClick={() => onNavigate('detail', prod._id || prod.id)}>
                                <img
                                    src={getProductImage(prod)}
                                    alt={prod.name}
                                    className="max-w-full max-h-full object-contain group-hover:scale-106 transition-transform duration-300"
                                />
                                {renderDiscountBadge(prod)}
                            </div>

                            {/* Details section below card */}
                            <div className="mt-3 md:mt-4 space-y-1 md:space-y-2">
                                <h4
                                    onClick={() => onNavigate('detail', prod._id || prod.id)}
                                    className="font-bold text-slate-800 text-xs md:text-sm hover:text-[#006a4e] transition-colors line-clamp-2 min-h-[32px] md:min-h-[40px] leading-tight"
                                >
                                    {prod.name}
                                </h4>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] md:text-xs font-semibold gap-1">
                                    {renderPriceWithDiscount(prod)}
                                    <span className="text-slate-400 font-medium">{prod.packageSize || '10 Tablets'}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 md:gap-3 pt-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isInCart(prod)) {
                                                removeFromCart(prod._id || prod.id);
                                            } else {
                                                addToCart(prod, 1);
                                            }
                                        }}
                                        className={`flex-1 active:scale-95 py-2 px-3 md:py-2.5 md:px-4 rounded-full text-[10px] md:text-xs transition-all cursor-pointer ${isInCart(prod)
                                            ? 'bg-[#dffe5e] hover:bg-[#d4f54e] text-[#033126] font-extrabold shadow-sm'
                                            : 'bg-[#006a4e] hover:bg-[#00543e] text-white font-bold'
                                            }`}
                                    >
                                        {isInCart(prod) ? 'Added' : 'Add to Cart'}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(prod);
                                        }}
                                        className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full border border-slate-200/60 hover:border-red-200 transition-all cursor-pointer group/heart shrink-0"
                                    >
                                        <Heart size={14} className={isInWishlist(prod) ? "fill-red-500 text-red-500 animate-in zoom-in-75 duration-200" : "transition-colors group-hover/heart:text-red-500"} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3.5 Promo Banners Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
                    {/* Left Banner: Maternal wellness & care */}
                    <div className="relative rounded-2xl bg-gradient-to-br from-[#e2f9d5] to-[#f4fdec] p-8 md:p-10 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 min-h-[240px] md:min-h-[280px]">
                        <div className="space-y-4 max-w-[55%] z-10">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-tight">
                                Maternal wellness <br />& care
                            </h3>
                            <button onClick={() => onNavigate('medicines')} className="bg-[#006a4e] hover:bg-[#00543e] active:scale-95 text-white font-bold py-2 px-5 rounded-full text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
                                Shop Now <span className="text-sm font-medium">→</span>
                            </button>
                        </div>

                        <div className="z-10 mt-6 text-left">
                            <span className="block text-3xl font-extrabold text-slate-800 leading-none">15%</span>
                            <span className="text-[11px] font-bold text-slate-500 tracking-wide uppercase mt-1 block">Cashback</span>
                        </div>

                        {/* Image overlay on right side with background blend/multiply */}
                        <div className="absolute right-0 bottom-0 top-0 w-[45%] md:w-[48%] flex items-end justify-end pointer-events-none select-none">
                            <img
                                src={materalCareImg}
                                alt="Maternal Care"
                                className="w-full h-full object-cover object-center mix-blend-multiply"
                                style={{
                                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 25%)',
                                    maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 25%)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Banner: Migraine & head pain relief */}
                    <div className="relative rounded-2xl bg-gradient-to-br from-[#dff2f5] to-[#f2fafb] p-8 md:p-10 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 min-h-[240px] md:min-h-[280px]">
                        <div className="space-y-4 max-w-[55%] z-10">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-tight">
                                Migraine & head <br />pain relief
                            </h3>
                            <button onClick={() => onNavigate('medicines')} className="bg-[#006a4e] hover:bg-[#00543e] active:scale-95 text-white font-bold py-2 px-5 rounded-full text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
                                Shop Now <span className="text-sm font-medium">→</span>
                            </button>
                        </div>

                        <div className="z-10 mt-6 text-left">
                            <span className="block text-3xl font-extrabold text-slate-800 leading-none">20%</span>
                            <span className="text-[11px] font-bold text-slate-500 tracking-wide uppercase mt-1 block">Cashback</span>
                        </div>

                        {/* Image overlay on right side with background blend/multiply */}
                        <div className="absolute right-0 bottom-0 top-0 w-[45%] md:w-[48%] flex items-end justify-end pointer-events-none select-none">
                            <img
                                src={meigreinTriggerImg}
                                alt="Headache relief"
                                className="w-full h-full object-cover object-center mix-blend-multiply"
                                style={{
                                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 25%)',
                                    maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 25%)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.6 Recent Products Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-8">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Recent products</h2>
                    <button
                        onClick={() => onNavigate('medicines')}
                        className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#5c6a3e] hover:text-[#006a4e] cursor-pointer transition-colors"
                    >
                        View all products <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {recent.map((prod) => (
                        <div
                            key={prod._id || prod.id}
                            className="cursor-pointer group flex flex-col justify-between"
                        >
                            {/* Card Box container */}
                            <div className="w-full aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center p-4 md:p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 relative" onClick={() => onNavigate('detail', prod._id || prod.id)}>
                                <img
                                    src={getProductImage(prod)}
                                    alt={prod.name}
                                    className="max-w-full max-h-full object-contain group-hover:scale-106 transition-transform duration-300"
                                />
                                {renderDiscountBadge(prod)}
                            </div>

                            {/* Details section below card */}
                            <div className="mt-3 md:mt-4 space-y-1 md:space-y-2">
                                <h4
                                    onClick={() => onNavigate('detail', prod._id || prod.id)}
                                    className="font-bold text-slate-800 text-xs md:text-sm hover:text-[#006a4e] transition-colors line-clamp-2 min-h-[32px] md:min-h-[40px] leading-tight"
                                >
                                    {prod.name}
                                </h4>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] md:text-xs font-semibold gap-1">
                                    {renderPriceWithDiscount(prod)}
                                    <span className="text-slate-400 font-medium">{prod.packageSize || '10 Tablets'}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 md:gap-3 pt-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isInCart(prod)) {
                                            removeFromCart(prod._id || prod.id);
                                        } else {
                                            addToCart(prod, 1);
                                        }
                                    }}
                                    className={`flex-1 active:scale-95 py-2 px-3 md:py-2.5 md:px-4 rounded-full text-[10px] md:text-xs transition-all cursor-pointer ${isInCart(prod)
                                        ? 'bg-[#dffe5e] hover:bg-[#d4f54e] text-[#033126] font-extrabold shadow-sm'
                                        : 'bg-[#006a4e] hover:bg-[#00543e] text-white font-bold'
                                        }`}
                                >
                                    {isInCart(prod) ? 'Added' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWishlist(prod);
                                    }}
                                    className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full border border-slate-200/60 hover:border-red-200 transition-all cursor-pointer group/heart shrink-0"
                                >
                                    <Heart size={14} className={isInWishlist(prod) ? "fill-red-500 text-red-500 animate-in zoom-in-75 duration-200" : "transition-colors group-hover/heart:text-red-500"} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Trust Badges Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 border-t border-slate-200/50 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-[#006a4e]/10 p-3 rounded-full text-[#006a4e]">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">100% Authentic</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">Direct sourcing from licensed pharmaceutical companies and authorized distributors.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-[#006a4e]/10 p-3 rounded-full text-[#006a4e]">
                            <Truck size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Secure Fast Delivery</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">Tempreture controlled handling to ensure chemical integrity of your medicines.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-[#006a4e]/10 p-3 rounded-full text-[#006a4e]">
                            <Clock size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">24/7 Support</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">Qualified pharmacists online round the clock to consult and assist you.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-[#006a4e]/10 p-3 rounded-full text-[#006a4e]">
                            <Award size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Licensed Pharmacy</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">Registered and accredited healthcare retail provider in Pakistan.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.7 Customer Testimonials Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-8">
                <div className="bg-[#004d38] rounded-2xl p-8 md:p-14 text-white">
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">What our Customers say</h2>
                        <button
                            onClick={handleNextTestimonial}
                            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#dffe5e] hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            Next <span className="text-sm">→</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* Left Active Card (Larger) */}
                        <div className="lg:col-span-8 bg-white rounded-2xl p-8 md:p-10 text-slate-800 flex flex-col justify-between shadow-sm min-h-[350px]">
                            {currentTestimonial.type === 'product' ? (
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
                                    <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6">
                                        <div className="space-y-4">
                                            {/* Trustpilot line */}
                                            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-bold">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className="w-[15px] h-[15px] bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                                                            <span className="text-white text-[8px]">★</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <span>{currentTestimonial.rating} ({currentTestimonial.reviewsCount})</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="flex items-center gap-0.5 text-slate-800">
                                                    <span className="text-[#00b67a]">★</span> Trustpilot
                                                </span>
                                            </div>

                                            <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
                                                {currentTestimonial.title}
                                            </h3>
                                            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                                                "{currentTestimonial.text}"
                                            </p>
                                        </div>

                                        {/* User profile details */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                            <img
                                                src={currentTestimonial.avatar}
                                                alt={currentTestimonial.author}
                                                className="w-10 h-10 rounded-full object-cover border border-slate-100"
                                            />
                                            <div>
                                                <h5 className="font-bold text-slate-800 text-sm leading-none">{currentTestimonial.author}</h5>
                                                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                                                    <span className="text-xs">✓</span> Verified Purchase
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-5 flex items-center justify-center h-full">
                                        <img
                                            src={currentTestimonial.productImage}
                                            alt="Featured product"
                                            className="max-h-[220px] object-contain rounded-2xl"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                                    <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                        <img
                                            src={currentTestimonial.storeImage}
                                            alt="Store Experience"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="w-full md:w-1/2 flex flex-col justify-between h-full space-y-6">
                                        <div className="space-y-4">
                                            {/* Trustpilot line */}
                                            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-bold">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className="w-[15px] h-[15px] bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                                                            <span className="text-white text-[8px]">★</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <span>{currentTestimonial.rating} ({currentTestimonial.reviewsCount})</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="flex items-center gap-0.5 text-slate-800">
                                                    <span className="text-[#00b67a]">★</span> Trustpilot
                                                </span>
                                            </div>

                                            <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
                                                {currentTestimonial.title}
                                            </h3>
                                            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                                                "{currentTestimonial.text}"
                                            </p>
                                        </div>

                                        {/* User profile details */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                            <img
                                                src={currentTestimonial.avatar}
                                                alt={currentTestimonial.author}
                                                className="w-10 h-10 rounded-full object-cover border border-slate-100"
                                            />
                                            <div>
                                                <h5 className="font-bold text-slate-800 text-sm leading-none">{currentTestimonial.author}</h5>
                                                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                                                    <span className="text-xs">✓</span> Verified Purchase
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Next Card (Smaller) */}
                        <div className="lg:col-span-4 bg-white rounded-2xl p-6 text-slate-800 flex flex-col justify-between shadow-sm min-h-[350px] opacity-90 hover:opacity-100 transition-opacity">
                            {nextTestimonial.type === 'store' ? (
                                <div className="flex flex-col justify-between h-full space-y-4">
                                    <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                        <img
                                            src={nextTestimonial.storeImage}
                                            alt="Store Experience"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-800 text-base leading-tight">
                                            {nextTestimonial.title}
                                        </h4>
                                        <p className="text-slate-500 font-medium text-xs leading-relaxed line-clamp-3">
                                            "{nextTestimonial.text}"
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-3 border-t border-slate-100">
                                        {/* Trustpilot line */}
                                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500 font-bold">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-[12px] h-[12px] bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                                                        <span className="text-white text-[7px]">★</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <span>{nextTestimonial.rating} ({nextTestimonial.reviewsCount})</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <img
                                                src={nextTestimonial.avatar}
                                                alt={nextTestimonial.author}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <h5 className="font-bold text-slate-800 text-xs leading-none">{nextTestimonial.author}</h5>
                                                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                                                    <span>✓</span> Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-between h-full space-y-4">
                                    <div className="w-full aspect-[16/10] rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
                                        <img
                                            src={nextTestimonial.productImage}
                                            alt="Featured product"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-800 text-base leading-tight">
                                            {nextTestimonial.title}
                                        </h4>
                                        <p className="text-slate-500 font-medium text-xs leading-relaxed line-clamp-3">
                                            "{nextTestimonial.text}"
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-3 border-t border-slate-100">
                                        {/* Trustpilot line */}
                                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500 font-bold">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-[12px] h-[12px] bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                                                        <span className="text-white text-[7px]">★</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <span>{nextTestimonial.rating} ({nextTestimonial.reviewsCount})</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <img
                                                src={nextTestimonial.avatar}
                                                alt={nextTestimonial.author}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <h5 className="font-bold text-slate-800 text-xs leading-none">{nextTestimonial.author}</h5>
                                                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                                                    <span>✓</span> Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
