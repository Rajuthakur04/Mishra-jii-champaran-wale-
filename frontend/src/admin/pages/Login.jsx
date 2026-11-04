import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SEO from "../../site/components/SEO";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a112e] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <SEO title="Admin Portal Login" noIndex={true} />
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 15%, rgba(244,115,66,0.18), transparent 55%), radial-gradient(circle at 85% 85%, rgba(242,87,43,0.1), transparent 45%)",
        }}
      />

      {/* Back to website button */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-semibold bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Back to Website</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Card */}
        <div className="text-center mb-8">
          <div className="inline-block relative mb-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#320104] p-1.5 ring-2 ring-amber-400/50 shadow-2xl shadow-brand/20 mx-auto flex items-center justify-center">
              <img src="/images/logo-brand.png" alt="Mishra Ji" className="h-full w-auto object-contain" />
            </div>
          </div>
          <h1 className="font-brand-title font-bold text-2xl sm:text-3xl text-white tracking-wide">
            MISHRA JI
          </h1>
          <p className="text-brand font-semibold text-xs uppercase tracking-[0.25em] mt-1">
            Admin Portal Access
          </p>
          <p className="text-white/50 text-xs mt-2">
            Secure control panel to manage shops, dynamic menus, and platform settings.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 border border-white/20">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
            <ShieldCheck className="w-5 h-5 text-brand" />
            <h2 className="font-display font-bold text-lg text-navy">Sign In to Dashboard</h2>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mishrajichamparanwale.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium text-navy bg-cream/30 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-medium text-navy bg-cream/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy/40 hover:text-navy/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand to-accent hover:opacity-95 text-white font-display font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          © {new Date().getFullYear()} Mishra Ji Champaran Wale · All Rights Reserved
        </p>
      </div>
    </div>
  );
}

