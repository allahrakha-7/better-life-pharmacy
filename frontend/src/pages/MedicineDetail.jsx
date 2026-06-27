import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBasket, Heart, Share2, Info, Star, ChevronRight, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { medicineService } from '../services/medicineService';

const RELATED_PRODUCTS = [
    { id: '66774003a3a6420893e4cd14', name: 'Panadol 500mg (Paracetamol)', price: 'Rs. 30', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', brand: 'GSK' },
    { id: '66774003a3a6420893e4cd15', name: 'Arinac Forte Tablet', price: 'Rs. 85', image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop&q=80', brand: 'Abbott' },
    { id: '66774003a3a6420893e4cd16', name: 'Ceevit 250mg Chewable Vitamin C', price: 'Rs. 90', image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=300&auto=format&fit=crop&q=80', brand: 'Square Pharma' },
];

export default function MedicineDetail({ onNavigate }) {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [wishlist, setWishlist] = useState(() => {
        const local = localStorage.getItem('wishlist');
        return local ? JSON.parse(local) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (prodId) => {
        setWishlist(prev => {
            const exists = prev.some(itemId => itemId === prodId);
            if (exists) {
                return prev.filter(itemId => itemId !== prodId);
            }
            return [...prev, prodId];
        });
    };

    const isInWishlist = (prodId) => {
        return wishlist.includes(prodId);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await medicineService.getMedicineById(id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to load medicine details:", err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="py-24 text-center text-slate-500 font-bold text-base max-w-7xl mx-auto px-6">
                <p className="animate-pulse">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="py-24 text-center max-w-7xl mx-auto px-6 space-y-4">
                <h3 className="font-extrabold text-2xl text-slate-800">Product Not Found</h3>
                <p className="text-slate-400 text-sm">{error || "The requested medicine does not exist in our catalog."}</p>
                <button
                    onClick={() => onNavigate('medicines')}
                    className="bg-[#006a4e] text-white px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer shadow-md hover:bg-[#00543e]"
                >
                    Back to Medicines
                </button>
            </div>
        );
    }

    const discountPrice = Math.round(product.price * 0.9);
    const sku = product.sku || `BL-MED-${product._id?.slice(-6).toUpperCase() || 'UNKNOWN'}`;
    const form = product.type || 'Tablet';
    const packageSize = product.packageSize || '10 Tablets per strip';
    const rating = product.rating || 4.7;
    const reviewsCount = product.reviewsCount || 94;
    const directions = product.directions || 'Take one tablet daily with a meal, or as directed by a healthcare professional.';
    const sideEffects = product.sideEffects || 'Generally well-tolerated. Mild gastrointestinal irritation may occur on empty stomach. Consult your doctor if symptoms persist.';
    const precautions = product.precautions || 'Consult your physician before use if you are pregnant, nursing, or have a pre-existing medical condition.';

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 space-y-12">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-500">
                <span className="hover:text-[#006a4e] cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
                <ChevronRight size={14} className="text-slate-400" />
                <span className="hover:text-[#006a4e] cursor-pointer" onClick={() => onNavigate('medicines')}>Medicines</span>
                <ChevronRight size={14} className="text-slate-400" />
                <span className="text-slate-800 line-clamp-1">{product.name}</span>
            </div>

            {/* 1. Main Product Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-sm items-start">

                {/* Product Image Gallery Wrapper */}
                <div className="w-full space-y-4">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 relative border border-slate-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {product.prescriptionRequired && (
                            <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                <FileText size={12} />
                                Rx Prescription Required
                            </span>
                        )}
                    </div>
                </div>

                {/* Product Core Actions & Detail Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-[#006a4e] uppercase tracking-widest">{product.brand}</span>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 pt-1">
                            <div className="flex items-center text-amber-500 gap-0.5">
                                <Star size={16} fill="currentColor" />
                                <span className="text-sm font-bold text-slate-800">{rating}</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-400">({reviewsCount} verified reviews)</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                        {/* Price */}
                        <div className="flex items-end gap-3">
                            <span className="text-2xl md:text-3xl font-black text-slate-800 leading-none">Rs. {discountPrice}</span>
                            <span className="text-sm font-semibold text-slate-400 line-through leading-none mb-1">Rs. {product.price}</span>
                            <span className="text-xs font-bold bg-[#dffe5e] text-[#033126] px-2 py-0.5 rounded-md leading-none mb-1 shadow-sm">SAVE 10%</span>
                        </div>

                        {/* Specifications */}
                        <div className="grid grid-cols-3 gap-4 text-xs md:text-sm pt-2 border-t border-slate-200/40">
                            <div>
                                <span className="text-slate-400 font-medium">Form</span>
                                <p className="font-bold text-slate-800 mt-0.5">{form}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">Package Size</span>
                                <p className="font-bold text-slate-800 mt-0.5">{packageSize}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 font-medium">SKU Code</span>
                                <p className="font-bold text-slate-800 mt-0.5 uppercase">{sku}</p>
                            </div>
                        </div>
                    </div>

                    {/* Prescription warning notice if Rx */}
                    {product.prescriptionRequired && (
                        <div className="bg-red-50/80 border border-red-100 rounded-2xl p-4 flex gap-3 text-red-800">
                            <Info size={20} className="shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="font-bold text-xs md:text-sm">Prescription Required</h4>
                                <p className="text-[11px] md:text-xs leading-relaxed text-red-700">
                                    You will need to upload or present a valid medical prescription from a registered doctor to complete checkout for this medicine.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Panel */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 shrink-0">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 py-2.5 font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="px-2 font-bold text-sm text-slate-800 w-8 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-4 py-2.5 font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to Cart button */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-sm"
                            >
                                <ShoppingBasket size={18} />
                                Add to Basket (Rs. {discountPrice * quantity})
                            </button>
                        </div>

                        {/* Extra buttons */}
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pl-2">
                            <button
                                onClick={() => toggleWishlist(product?._id || product?.id)}
                                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${isInWishlist(product?._id || product?.id)
                                    ? 'text-red-500 font-bold'
                                    : 'hover:text-red-500'
                                    }`}
                            >
                                <Heart size={16} className={isInWishlist(product?._id || product?.id) ? "fill-red-500 text-red-500" : ""} /> Wishlist
                            </button>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <button className="flex items-center gap-1.5 hover:text-[#006a4e] transition-colors cursor-pointer">
                                <Share2 size={16} /> Share Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Technical details tabs section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex border-b border-slate-100 overflow-x-auto gap-6">
                    {['description', 'directions', 'sideEffects', 'precautions'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold capitalize transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === tab
                                ? 'border-[#006a4e] text-[#006a4e]'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab.replace(/([A-Z])/g, ' $1')}
                        </button>
                    ))}
                </div>

                <div className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-4xl min-h-[100px] animate-in fade-in duration-200">
                    {activeTab === 'description' && <p>{product.description}</p>}
                    {activeTab === 'directions' && <p>{directions}</p>}
                    {activeTab === 'sideEffects' && <p>{sideEffects}</p>}
                    {activeTab === 'precautions' && <p>{precautions}</p>}
                </div>
            </div>

            {/* 3. Related Products Recommendations Grid */}
            <div className="space-y-6">
                <h3 className="font-extrabold text-2xl text-slate-800">You Might Also Need</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {RELATED_PRODUCTS.map((prod) => (
                        <div
                            key={prod.id}
                            className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4 group"
                        >
                            <div
                                onClick={() => onNavigate('detail', prod.id)}
                                className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 cursor-pointer"
                            >
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-[#006a4e] uppercase">{prod.brand}</span>
                                <h4
                                    onClick={() => onNavigate('detail', prod.id)}
                                    className="font-bold text-slate-800 text-sm hover:text-[#006a4e] transition-colors cursor-pointer line-clamp-1"
                                >
                                    {prod.name}
                                </h4>
                                <span className="text-sm font-bold text-slate-800 block">{prod.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
