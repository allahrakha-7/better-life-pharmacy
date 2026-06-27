import { useState, useEffect } from 'react';
import { ArrowLeft, Search, PlusCircle, Trash2, ShieldAlert, ChevronDown } from 'lucide-react';
import { medicineService } from '../../services/medicineService';

export default function ManageInventory({ onNavigate }) {
    const [inventory, setInventory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('Prescription Medicines');
    const [type, setType] = useState('Tablet');
    const [image, setImage] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        const fetchInventory = async () => {
            try {
                const data = await medicineService.getMedicines();
                if (active) {
                    setInventory(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load inventory:", err);
                if (active) {
                    setError("Failed to load inventory. Please ensure you are logged in as an admin.");
                    setLoading(false);
                }
            }
        };
        fetchInventory();
        return () => { active = false; };
    }, []);

    const handleImageFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploadingImage(true);
        try {
            const data = await medicineService.uploadMedicineImage(formData);
            setImage(data.imageUrl);
        } catch (err) {
            console.error("Image upload failed:", err);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!name || !price || !stock) return;

        try {
            const newProduct = {
                name,
                brand: brand || 'Generic',
                category,
                type,
                price: Number(price),
                stock: Number(stock),
                image: image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
                description: description || 'No description provided.',
                prescriptionRequired: category === 'Prescription Medicines'
            };

            const created = await medicineService.createMedicine(newProduct);
            setInventory(prev => [created, ...prev]);

            // Clear inputs
            setName('');
            setBrand('');
            setPrice('');
            setStock('');
            setImage('');
            setDescription('');
            setShowAddForm(false);
        } catch (err) {
            console.error("Failed to create medicine:", err);
            alert("Error creating medicine: " + err.message);
        }
    };

    const handleUpdateStock = async (id, change) => {
        const item = inventory.find(i => i._id === id);
        if (!item) return;

        const newStock = Math.max(0, (item.stock || 0) + change);
        try {
            await medicineService.updateMedicine(id, { stock: newStock });
            setInventory(prev => prev.map(item => item._id === id ? { ...item, stock: newStock } : item));
        } catch (err) {
            console.error("Failed to update stock:", err);
            alert("Error updating stock count.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this medicine?")) return;
        try {
            await medicineService.deleteMedicine(id);
            setInventory(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error("Failed to delete medicine:", err);
            alert("Error deleting product.");
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="py-24 text-center max-w-7xl mx-auto px-6 text-slate-500 font-bold">
                <span className="animate-pulse">Loading inventory items...</span>
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Manage Inventory</h1>
                        <p className="text-slate-500 text-xs md:text-sm mt-1">Adjust item counts, delete expired items, or append new pharmacy releases.</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-[#006a4e] hover:bg-[#00543e] active:scale-95 text-white font-bold py-3 px-6 rounded-full text-xs md:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <PlusCircle size={16} /> Add Product
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-2xl text-xs md:text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Add New Product Form */}
            {showAddForm && (
                <form onSubmit={handleAddProduct} className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="md:col-span-12 font-extrabold text-slate-800 text-lg border-b border-slate-55 pb-2">Add New Product Form</h3>

                    <div className="md:col-span-4 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">Product Name <span className="text-red-500">*</span></label>
                        <input
                            type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Napa Extra"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">Brand Name</label>
                        <input
                            type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. GSK"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">Category</label>
                        <div className="relative">
                            <select
                                value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full appearance-none border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-bold text-slate-700 cursor-pointer transition-colors"
                            >
                                <option value="Prescription Medicines">Prescription Medicines</option>
                                <option value="OTC Medicines">OTC Medicines</option>
                                <option value="Baby & Mother Care">Baby & Mother Care</option>
                                <option value="Personal Care">Personal Care</option>
                                <option value="Wellness & Supplements">Wellness & Supplements</option>
                                <option value="Medical Devices & Surgical">Medical Devices & Surgical</option>
                                <option value="Herbals & Organics">Herbals & Organics</option>
                                <option value="Homeopathy">Homeopathy</option>
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">Dosage Form</label>
                        <div className="relative">
                            <select
                                value={type} onChange={e => setType(e.target.value)}
                                className="w-full appearance-none border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-bold text-slate-700 cursor-pointer transition-colors"
                            >
                                <option value="Tablet">Tablet</option>
                                <option value="Capsule">Capsule</option>
                                <option value="Syrup">Syrup</option>
                                <option value="Injection">Injection</option>
                                <option value="Cream">Cream</option>
                                <option value="Powder">Powder</option>
                                <option value="Device">Device</option>
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                    <div className="md:col-span-6 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">Product Image</label>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#006a4e]/10 file:text-[#006a4e] hover:file:bg-[#006a4e]/20 cursor-pointer"
                                />
                                {uploadingImage && (
                                    <span className="text-[10px] font-bold text-amber-600 mt-1 block animate-pulse">Uploading image...</span>
                                )}
                            </div>
                            {image && (
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        {/* URL entry fallback */}
                        <input
                            type="text"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            placeholder="Or paste an image URL here..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 text-[10px] md:text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium mt-1.5"
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">Price (Rs.) <span className="text-red-500">*</span></label>
                        <input
                            type="number" required value={price} onChange={e => setPrice(e.target.value)} placeholder="Rs"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">Stock Count <span className="text-red-500">*</span></label>
                        <input
                            type="number" required value={stock} onChange={e => setStock(e.target.value)} placeholder="Qty"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium"
                        />
                    </div>
                    <div className="md:col-span-12 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">Description</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)} placeholder="Add description..."
                            rows={3}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#006a4e]/30 font-medium resize-none"
                        />
                    </div>
                    <div className="md:col-span-12 flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setShowAddForm(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-full text-xs cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" className="bg-[#006a4e] hover:bg-[#00543e] text-white font-bold px-5 py-2 rounded-full text-xs cursor-pointer shadow-sm">
                            Add Product
                        </button>
                    </div>
                </form>
            )}

            {/* Inventory table */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">

                {/* Search */}
                <div className="relative max-w-md bg-slate-50 border border-slate-100 rounded-full flex items-center px-4 py-2 hover:border-slate-200 focus-within:border-[#006a4e]/30 focus-within:bg-white transition-all duration-200">
                    <Search size={16} className="text-slate-400 shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by name, brand, or category..."
                        className="w-full bg-transparent border-none outline-none pl-2 text-xs md:text-sm text-slate-800 focus:outline-none placeholder-slate-400 font-semibold"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-semibold">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                                <th className="pb-4 pr-4">Code</th>
                                <th className="pb-4 pr-4">Medicine</th>
                                <th className="pb-4 pr-4">Category</th>
                                <th className="pb-4 pr-4">Price</th>
                                <th className="pb-4 pr-4">Stock Status</th>
                                <th className="pb-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-600">
                            {filteredInventory.map((item) => {
                                const code = item._id ? `MED-${item._id.slice(-6).toUpperCase()}` : 'GEN-CODE';
                                return (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 pr-4 text-xs font-mono text-slate-400 select-all">{code}</td>
                                        <td className="py-4 pr-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-medium font-bold">By {item.brand} ({item.type})</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 text-slate-400">{item.category}</td>
                                        <td className="py-4 pr-4 font-bold text-slate-800">Rs. {item.price}</td>
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleUpdateStock(item._id, -10)}
                                                    className="px-2 py-0.5 border border-slate-200 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                                                >
                                                    -10
                                                </button>
                                                <span className={`w-12 text-center font-bold ${(item.stock === undefined || item.stock === 0) ? 'text-red-500 font-extrabold' : 'text-slate-800'}`}>
                                                    {(item.stock === undefined || item.stock === 0) ? 'Out of stock' : `${item.stock} units`}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateStock(item._id, 10)}
                                                    className="px-2 py-0.5 border border-slate-200 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                                                >
                                                    +10
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs leading-relaxed font-semibold">
                <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p>
                    Stock Audits: Inventory updates must correspond to incoming warehouse receipts. Changing figures manually without physical verification is logged.
                </p>
            </div>
        </div>
    );
}
