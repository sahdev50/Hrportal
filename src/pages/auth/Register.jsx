import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Briefcase,
  Building,
} from "lucide-react";
import { api } from "../../services/api";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const existingUsers = await api.get(`/users?email=${data.email}`);
      if (existingUsers.length > 0) {
        toast.error("Email is already registered.");
        setIsLoading(false);
        return;
      }
      const newEmployee = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        department: data.department,
        jobTitle: data.jobTitle,
        status: "Active",
        dateJoined: new Date().toISOString().split("T")[0],
        avatar: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=7C3AED&color=fff`,
      };

      const createdEmployee = await api.post("/employees", newEmployee);

      const hashedPassword = bcrypt.hashSync(data.password, 10);

      const newUser = {
        id: Date.now().toString(),
        email: data.email,
        password: hashedPassword,
        role: "employee",
        employeeId: createdEmployee.id,
      };

      await api.post("/users", newUser);

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light/30 p-4 py-12">
      <div className="card w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-deep mb-2">
            Join the Team
          </h1>
          <p className="text-text-secondary text-sm">
            Create your employee portal account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type="text"
                  className={`input-field pl-10 ${errors.firstName ? "border-error" : ""}`}
                  placeholder="First name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
              </div>
              {errors.firstName && (
                <p className="text-error text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type="text"
                  className={`input-field pl-10 ${errors.lastName ? "border-error" : ""}`}
                  placeholder="Last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
              </div>
              {errors.lastName && (
                <p className="text-error text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-main mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type="email"
                  className={`input-field pl-10 ${errors.email ? "border-error" : ""}`}
                  placeholder="name@company.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-text-secondary" />
                </div>
                <select
                  className={`input-field pl-10 appearance-none bg-white ${errors.department ? "border-error" : ""}`}
                  {...register("department", {
                    required: "Department is required",
                  })}
                >
                  <option value="">Select Department</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              {errors.department && (
                <p className="text-error text-xs mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Job Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type="text"
                  className={`input-field pl-10 ${errors.jobTitle ? "border-error" : ""}`}
                  placeholder="e.g. Frontend Developer"
                  {...register("jobTitle", {
                    required: "Job title is required",
                  })}
                />
              </div>
              {errors.jobTitle && (
                <p className="text-error text-xs mt-1">
                  {errors.jobTitle.message}
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
                  className={`input-field pl-10 pr-10 ${errors.password ? "border-error" : ""}`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary"
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
                <p className="text-error text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input-field pl-10 ${errors.confirmPassword ? "border-error" : ""}`}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3"
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
