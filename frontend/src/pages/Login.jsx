import { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import headerLogo from '../assets/images/header_logo.png';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function Login({ onNavigate }) {
    const { login: setAuthUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(email, password);
            setAuthUser(data, remember);

            // Redirect based on role
            if (data.role === 'admin' || data.isAdmin) {
                onNavigate('admin');
            } else {
                onNavigate('home');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || err.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 pb-20 flex justify-center items-center">

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
                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">Welcome Back</h2>
                        <p className="text-xs font-semibold text-slate-400">Log in to manage prescriptions and track orders.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 pl-1 uppercase tracking-wider">Email Address</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-3 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                            <Mail size={18} className="text-slate-400 shrink-0" />
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

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center pl-1">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                            <button type="button" className="text-xs font-bold text-[#006a4e] hover:text-[#00543e]">Forgot?</button>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-3 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                            <Lock size={18} className="text-slate-400 shrink-0" />
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
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember me checkbox */}
                    <div className="flex items-center gap-2 pl-1 select-none cursor-pointer">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="w-4 h-4 accent-[#006a4e] border-slate-300 rounded cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-xs font-semibold text-slate-500 cursor-pointer">
                            Keep me logged in
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white font-bold py-3.5 px-6 rounded-full shadow-lg transition-all cursor-pointer text-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer link to Register */}
                <div className="text-center pt-4 border-t border-slate-100 text-xs md:text-sm font-semibold text-slate-500">
                    Don't have an account?{' '}
                    <button
                        onClick={() => onNavigate('register')}
                        className="text-[#006a4e] hover:text-[#00543e] font-bold cursor-pointer"
                    >
                        Register Now
                    </button>
                </div>

                <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 font-bold justify-center pt-2">
                    <ShieldCheck size={14} className="text-[#006a4e]" />
                    <span>Your credentials are encrypted & secure</span>
                </div>
            </div>

        </div>
    );
}
