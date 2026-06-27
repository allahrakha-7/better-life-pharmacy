import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MedicineCard({ product, viewMode = 'grid', onNavigate, onAddToCart }) {
    const { addToCart, removeFromCart, cartItems } = useCart();
    
    if (!product) return null;

    const prodId = product._id || product.id;
    const isInCart = cartItems?.some(item => (item._id === prodId || item.id === prodId)) || false;

    const handleCardClick = () => {
        if (onNavigate) onNavigate('detail', prodId);
    };

    const handleAddClick = (e) => {
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        } else {
            if (isInCart) {
                removeFromCart(prodId);
            } else {
                addToCart(product, 1);
            }
        }
    };

    const renderPriceWithDiscount = () => {
        const priceStr = product.price;
        const priceVal = typeof priceStr === 'string' 
            ? parseFloat(priceStr.replace(/[^0-9.]/g, '')) 
            : parseFloat(priceStr);
            
        if (isNaN(priceVal)) {
            return <span className="text-sm md:text-base lg:text-lg font-bold text-slate-800">Rs. {priceStr}</span>;
        }

        if (priceVal >= 1000) {
            const originalVal = Math.round(priceVal * 1.15); // 15% discount
            return (
                <div className="flex flex-wrap items-baseline gap-1 md:gap-1.5">
                    <span className="text-sm md:text-base lg:text-lg font-bold text-slate-800">Rs. {priceVal.toLocaleString()}</span>
                    <span className="text-slate-400 line-through text-[10px] md:text-[11px] font-normal">Rs. {originalVal.toLocaleString()}</span>
                </div>
            );
        }

        return <span className="text-sm md:text-base lg:text-lg font-bold text-slate-800">Rs. {priceVal.toLocaleString()}</span>;
    };

    const showDiscountBadge = () => {
        const priceVal = typeof product.price === 'string' 
            ? parseFloat(product.price.replace(/[^0-9.]/g, '')) 
            : parseFloat(product.price);
        if (!isNaN(priceVal) && priceVal >= 1000) {
            return (
                <span className="absolute top-2 right-2 bg-[#dffe5e] text-[#033126] text-[8px] md:text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 shadow-sm">
                    15% OFF
                </span>
            );
        }
        return null;
    };

    return (
        <div 
            onClick={handleCardClick}
            className={`bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all duration-300 flex ${
                viewMode === 'grid' ? 'flex-col justify-between' : 'flex-row items-center gap-4 md:gap-6'
            } group cursor-pointer`}
        >
            {/* Product Image */}
            <div 
                className={`rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 relative shrink-0 ${
                    viewMode === 'grid' ? 'w-full aspect-[4/3] mb-3 md:mb-4' : 'w-20 h-20 md:w-32 md:h-32'
                }`}
            >
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-[#006a4e] text-white text-[8px] md:text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full z-10">
                    {product.type}
                </span>
                {showDiscountBadge()}
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between h-full w-full">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] md:text-[10px] font-bold text-[#006a4e] uppercase tracking-wide">
                            {product.brand}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase">
                            {product.category?.split(' ')[0] || 'General'}
                        </span>
                    </div>
                    <h4 
                        className="font-bold text-slate-800 text-xs md:text-sm lg:text-base hover:text-[#006a4e] transition-colors line-clamp-1"
                    >
                        {product.name}
                    </h4>
                    <p className="text-[10px] md:text-xs text-slate-400 font-normal leading-relaxed line-clamp-2">
                        {product.description}
                    </p>
                </div>

                <div className={`mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:items-center justify-between ${viewMode === 'list' ? 'mt-6' : ''}`}>
                    {renderPriceWithDiscount()}
                    <button 
                        onClick={handleAddClick}
                        className={`active:scale-95 font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs transition-all flex items-center justify-center gap-1 cursor-pointer w-full sm:w-auto ${
                            isInCart 
                                ? 'bg-[#dffe5e] text-[#033126]' 
                                : 'bg-[#006a4e] text-white hover:bg-[#00543e]'
                        }`}
                    >
                        <ShoppingCart size={12} />
                        {isInCart ? 'Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
