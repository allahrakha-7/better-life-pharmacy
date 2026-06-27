import { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import headerLogo from '../assets/images/header_logo.png';
import { authService } from '../services/authService';

export default function Resgiter({ onNavigate }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authService.register(name, email, password);
            onNavigate('login');
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || err.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-16 flex justify-center items-center">

            <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 md:p-10 shadow-xl space-y-6">

                {/* Brand Logo & Intro */}
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="flex items-center gap-1.5 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
                        <img src={headerLogo} alt="Better Life Logo" className="w-12 h-12 object-contain" />
                        <span className="text-xl font-bold text-[#004d38] tracking-tight">
                            Better Life
                        </span>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">Create Account</h2>
                        <p className="text-xs font-semibold text-slate-400">Join Better Life for fast delivery & easy prescriptions.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 pl-1 uppercase tracking-wider">Full Name</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                            <User size={16} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-transparent border-none outline-none pl-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 pl-1 uppercase tracking-wider">Email Address</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                            <Mail size={16} className="text-slate-400 shrink-0" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-transparent border-none outline-none pl-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 pl-1 uppercase tracking-wider">Phone Number</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                            <Phone size={16} className="text-slate-400 shrink-0" />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="03XXXXXXXXX"
                                className="w-full bg-transparent border-none outline-none pl-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 pl-1 uppercase tracking-wider">Password</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                            <Lock size={16} className="text-slate-400 shrink-0" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-transparent border-none outline-none pl-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-0.5 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Terms checkbox */}
                    <div className="flex items-start gap-2 pl-1 pt-1 select-none cursor-pointer">
                        <input
                            type="checkbox"
                            required
                            id="terms"
                            className="w-4 h-4 accent-[#006a4e] border-slate-300 rounded cursor-pointer mt-0.5"
                        />
                        <label htmlFor="terms" className="text-[11px] font-semibold text-slate-500 cursor-pointer leading-normal">
                            I agree to the Better Life <span className="text-[#006a4e] hover:underline font-bold">Terms of Service</span> and <span className="text-[#006a4e] hover:underline font-bold">Privacy Policy</span>.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all cursor-pointer text-sm mt-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                {/* Footer link to Login */}
                <div className="text-center pt-4 border-t border-slate-100 text-xs md:text-sm font-semibold text-slate-500">
                    Already have an account?{' '}
                    <button
                        onClick={() => onNavigate('login')}
                        className="text-[#006a4e] hover:text-[#00543e] font-bold cursor-pointer"
                    >
                        Sign In
                    </button>
                </div>

                <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold justify-center pt-1">
                    <ShieldCheck size={14} className="text-[#006a4e]" />
                    <span>Your data privacy is fully guaranteed</span>
                </div>
            </div>

        </div>
    );
}
