import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid, List, Check, X } from 'lucide-react';
import MedicineCard from '../components/MedicineCard';
import { medicineService } from '../services/medicineService';
import useDebounce from '../hooks/useDebounce';

const CATEGORIES = [
    'All Categories',
    'Prescription Medicines',
    'OTC Medicines',
    'Baby & Mother Care',
    'Personal Care',
    'Wellness & Supplements',
    'Medical Devices & Surgical',
    'Herbals & Organics',
    'Homeopathy'
];

export default function Medicines({ onNavigate }) {
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState(3000);
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 450);
    const debouncedPrice = useDebounce(priceRange, 450);

    useEffect(() => {
        const fetchMedicines = async () => {
            setLoading(true);
            try {
                const params = {};
                if (selectedCategory !== 'All Categories') params.category = selectedCategory;
                if (debouncedSearch) params.search = debouncedSearch;
                if (debouncedPrice) params.maxPrice = debouncedPrice;

                const data = await medicineService.getMedicines(params);
                setMedicines(data);
            } catch (err) {
                console.error("Failed to load medicines:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMedicines();
    }, [selectedCategory, debouncedSearch, debouncedPrice]);

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 space-y-8">
            {/* Header section */}
            <div>
                <span className="text-sm font-bold text-[#006a4e] uppercase tracking-wider">Better Life Pharmacy</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-1">Browse Medicines & Healthcare</h1>
                <p className="text-slate-500 text-sm md:text-base mt-2">Find and filter authentic pharmacy supplies and wellness products.</p>
            </div>

            {/* Main body: Filters & Grid */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* 1. Sidebar Filters */}
                <aside className="w-full lg:w-72 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 shrink-0 lg:sticky lg:top-24 relative">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <SlidersHorizontal size={18} className="text-[#006a4e]" />
                            Filters
                        </h3>
                        <button
                            onClick={() => {
                                setSelectedCategory('All Categories');
                                setSearchQuery('');
                                setPriceRange(3000);
                            }}
                            className="text-xs font-semibold text-[#006a4e] hover:text-[#00543e] cursor-pointer"
                        >
                            Reset All
                        </button>
                    </div>

                    {/* Filter Toggle Button for Mobile */}
                    <button
                        type="button"
                        onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                        className="w-full lg:hidden bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                        <SlidersHorizontal size={14} className="text-[#006a4e]" />
                        {showFiltersMobile ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    {/* Filter Contents - always visible on lg, toggled on mobile */}
                    <div className={`${showFiltersMobile ? 'block animate-in fade-in duration-200' : 'hidden lg:block'} space-y-6`}>
                        {/* Category List */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-slate-800 text-sm">Categories</h4>
                            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
                                {CATEGORIES.map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs md:text-sm transition-all duration-150 flex items-center justify-between font-medium cursor-pointer ${selectedCategory === cat
                                            ? 'bg-[#006a4e]/10 text-[#006a4e]'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        {cat}
                                        {selectedCategory === cat && <Check size={14} className="text-[#006a4e]" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Slider */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-800 text-sm">Max Price</h4>
                                <span className="text-xs font-bold text-[#006a4e]">Rs. {priceRange}</span>
                            </div>
                            <input
                                type="range"
                                min="30"
                                max="3000"
                                step="10"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-[#006a4e] h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                <span>Rs. 30</span>
                                <span>Rs. 3,000</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 2. Listing Display */}
                <div className="flex-1 w-full space-y-6">
                    {/* Control Panel */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                        {/* Search bar inside list */}
                        <div className="relative flex-1 max-w-md bg-slate-50 border border-slate-100 rounded-full flex items-center px-4 py-2 hover:border-slate-200 focus-within:border-[#006a4e]/30 focus-within:bg-white transition-all duration-200">
                            <Search size={16} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or brand..."
                                className="w-full bg-transparent border-none outline-none pl-2 text-xs md:text-sm text-slate-800 focus:outline-none placeholder-slate-400"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-slate-200 rounded-full">
                                    <X size={12} className="text-slate-400" />
                                </button>
                            )}
                        </div>

                        {/* View Switcher & Counter */}
                        <div className="flex items-center justify-between sm:justify-start gap-6 shrink-0">
                            <span className="text-xs font-semibold text-slate-500">
                                Showing {medicines.length} products
                            </span>

                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-0.5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#006a4e] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#006a4e] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Container */}
                    {loading ? (
                        <div className="py-24 text-center text-slate-400 font-semibold text-sm">
                            <span className="animate-pulse">Loading authentic medicines...</span>
                        </div>
                    ) : medicines.length > 0 ? (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                            : "space-y-4"
                        }>
                            {medicines.map((prod) => (
                                <MedicineCard
                                    key={prod._id || prod.id}
                                    product={prod}
                                    viewMode={viewMode}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-2xl py-16 px-6 text-center shadow-sm">
                            <span className="text-4xl">🔍</span>
                            <h3 className="font-bold text-slate-800 text-lg mt-3">No Products Found</h3>
                            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-sm mx-auto">We couldn't find any products matching your filters. Try resetting the filters or searching for something else.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
