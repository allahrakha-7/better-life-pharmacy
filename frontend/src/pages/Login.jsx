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

    // Forgot Password States
    const [forgotModalOpen, setForgotModalOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotStep, setForgotStep] = useState(1); // 1 = request, 2 = verify & reset
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleForgotPasswordRequest = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotError('');
        setForgotSuccess('');
        try {
            const res = await authService.forgotPassword(forgotEmail);
            setForgotSuccess(res.message);
            if (res.otp) {
                setOtp(res.otp);
            }
            setForgotStep(2);
        } catch (err) {
            setForgotError(err.response?.data?.message || err.message || "Failed to submit request.");
        } finally {
            setForgotLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotError('');
        setForgotSuccess('');
        try {
            const res = await authService.resetPassword(forgotEmail, otp, newPassword);
            setForgotSuccess(res.message);
            setTimeout(() => {
                setForgotModalOpen(false);
                setForgotEmail('');
                setOtp('');
                setNewPassword('');
                setForgotStep(1);
                setForgotSuccess('');
            }, 3000);
        } catch (err) {
            setForgotError(err.response?.data?.message || err.message || "Failed to reset password.");
        } finally {
            setForgotLoading(false);
        }
    };

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
                            <button type="button" onClick={() => { setForgotModalOpen(true); setForgotStep(1); setForgotError(''); setForgotSuccess(''); }} className="text-xs font-bold text-[#006a4e] hover:text-[#00543e]">Forgot?</button>
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

            {/* Forgot Password Modal */}
            {forgotModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl w-full max-w-md p-7 md:p-9 relative animate-in zoom-in-95 duration-200 text-slate-700 animate-fade-in">
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setForgotModalOpen(false);
                                setForgotEmail('');
                                setOtp('');
                                setNewPassword('');
                                setForgotStep(1);
                                setForgotSuccess('');
                                setForgotError('');
                            }}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-lg font-bold"
                        >
                            ✕
                        </button>

                        <div className="space-y-4">
                            <h3 className="font-extrabold text-slate-800 text-xl">Reset Your Password</h3>
                            <p className="text-xs text-slate-400 font-medium">
                                {forgotStep === 1 
                                    ? "Enter your registered email address to receive a 6-digit recovery code." 
                                    : "Enter the code and your new password to complete the reset."}
                            </p>

                            {forgotError && (
                                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-2xl text-xs font-semibold">
                                    {forgotError}
                                </div>
                            )}

                            {forgotSuccess && (
                                <div className="bg-[#006a4e]/5 border border-[#006a4e]/10 text-[#006a4e] p-3 rounded-2xl text-xs font-semibold">
                                    {forgotSuccess}
                                </div>
                            )}

                            {forgotStep === 1 ? (
                                <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Email Address</label>
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-3 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                                            <Mail size={18} className="text-slate-400 shrink-0" />
                                            <input
                                                type="email"
                                                required
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                className="w-full bg-transparent border-none outline-none pl-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="w-full bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white font-bold py-3.5 px-6 rounded-full shadow-lg transition-all cursor-pointer text-xs md:text-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    >
                                        {forgotLoading ? 'Submitting...' : 'Request Code'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handlePasswordReset} className="space-y-4">
                                    {/* OTP Code */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">6-Digit Code</label>
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-3 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                                            <Lock size={18} className="text-slate-400 shrink-0" />
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter 6-digit OTP"
                                                className="w-full bg-transparent border-none outline-none pl-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-bold tracking-widest text-center"
                                            />
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">New Password</label>
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-3 hover:border-slate-300 focus-within:border-[#006a4e]/40 focus-within:bg-white transition-all duration-200">
                                            <Lock size={18} className="text-slate-400 shrink-0" />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                className="w-full bg-transparent border-none outline-none pl-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="w-full bg-[#006a4e] hover:bg-[#00543e] active:scale-98 text-white font-bold py-3.5 px-6 rounded-full shadow-lg transition-all cursor-pointer text-xs md:text-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    >
                                        {forgotLoading ? 'Resetting Password...' : 'Reset Password'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
