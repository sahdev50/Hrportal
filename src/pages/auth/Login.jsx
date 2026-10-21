import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("hr_portal_remember");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const response = await login(data.email, data.password, data.rememberMe);
    setIsLoading(false);

    if (response.success) {
      toast.success("Login successful!");
      navigate(`/${response.role}/dashboard`);
    } else {
      toast.error(response.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light/30 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 items-center">
        <div className="card w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-deep mb-2">
              Welcome Back
            </h1>
            <p className="text-text-secondary text-sm">
              Sign in to your HR Portal account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type="email"
                  className={`input-field pl-10 ${errors.email ? "border-error focus:ring-error" : ""}`}
                  placeholder="name@company.com"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input-field pl-10 pr-10 ${errors.password ? "border-error focus:ring-error" : ""}`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary mr-2"
                  {...register("rememberMe")}
                />
                <span className="text-text-secondary">Remember me</span>
              </label>
              <button
                type="button"
                className="text-primary hover:text-primary-deep font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            New employee?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
        <div className="hidden md:block bg-primary text-white p-8 rounded-3xl shadow-soft h-full flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Lock className="mr-2" /> Demo Credentials
          </h2>
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <h3 className="font-semibold text-primary-light mb-2">
                HR Manager Account
              </h3>
              <p className="text-sm font-mono bg-black/20 p-2 rounded mb-1">
                Email: hr@company.com
              </p>
              <p className="text-sm font-mono bg-black/20 p-2 rounded">
                Pass: password123
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <h3 className="font-semibold text-primary-light mb-2">
                Employee Account
              </h3>
              <p className="text-sm font-mono bg-black/20 p-2 rounded mb-1">
                Email: employee@company.com
              </p>
              <p className="text-sm font-mono bg-black/20 p-2 rounded">
                Pass: password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
