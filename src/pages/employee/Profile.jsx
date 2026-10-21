import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  UserCircle,
  Mail,
  Briefcase,
  Building,
  Calendar,
  Phone,
  MapPin,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { api } from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchProfile = async () => {
    try {
      const data = await api.get(`/employees/${user.profile.id}`);
      setProfile(data);
      reset(data);
    } catch (error) {
      toast.error("Failed to load profile details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.profile?.id) {
      fetchProfile();
    }
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const updatedProfile = {
        ...profile,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        avatar: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=7C3AED&color=fff`,
      };

      await api.put(`/employees/${profile.id}`, updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Personal profile updated successfully.");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-text-secondary">
        Loading profile...
      </div>
    );
  if (!profile)
    return <div className="p-8 text-center text-error">Profile not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-deep to-primary"></div>
        <div className="relative pt-12 px-4 sm:px-6 flex flex-col sm:flex-row items-center sm:items-end sm:justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left">
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-card bg-card shadow-md object-cover"
            />
            <div className="sm:ml-6 mt-4 sm:mt-0 mb-2">
              <h1 className="text-2xl font-bold text-text-main">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-text-secondary font-medium">
                {profile.jobTitle}
              </p>
            </div>
          </div>
          <div className="mt-6 sm:mt-0 mb-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center"
              >
                <Edit2 size={16} className="mr-2" /> Edit Personal Details
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  reset(profile);
                }}
                className="btn-secondary flex items-center text-text-secondary hover:text-error hover:border-error/30"
              >
                <X size={16} className="mr-2" /> Cancel Editing
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center">
              <Briefcase className="mr-2 text-primary" size={20} /> Employment
              Info
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">
                  Employee ID
                </p>
                <p className="text-sm font-semibold text-text-main">
                  EMP-{profile.id.toString().padStart(4, "0")}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">
                  Department
                </p>
                <div className="flex items-center text-sm font-medium text-text-main">
                  <Building size={16} className="mr-2 text-text-secondary" />{" "}
                  {profile.department}
                </div>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">
                  Date Joined
                </p>
                <div className="flex items-center text-sm font-medium text-text-main">
                  <Calendar size={16} className="mr-2 text-text-secondary" />{" "}
                  {new Date(profile.dateJoined).toLocaleDateString()}
                </div>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">
                  Status
                </p>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                    profile.status === "Active"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {profile.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card h-full">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center">
              <UserCircle className="mr-2 text-primary" size={20} /> Personal
              Details
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? "bg-background text-text-secondary border-transparent" : ""} ${errors.firstName ? "border-error" : ""}`}
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? "bg-background text-text-secondary border-transparent" : ""} ${errors.lastName ? "border-error" : ""}`}
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1 flex items-center">
                    <Mail size={16} className="mr-1.5 text-text-secondary" />{" "}
                    Email Address (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled={true}
                    className="input-field bg-background text-text-secondary border-transparent cursor-not-allowed"
                    value={profile.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1 flex items-center">
                    <Phone size={16} className="mr-1.5 text-text-secondary" />{" "}
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    placeholder="+1 (555) 000-0000"
                    className={`input-field ${!isEditing ? "bg-background text-text-secondary border-transparent" : ""}`}
                    {...register("phone")}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1 flex items-center">
                    <MapPin size={16} className="mr-1.5 text-text-secondary" />{" "}
                    Home Address
                  </label>
                  <textarea
                    disabled={!isEditing}
                    rows="2"
                    placeholder="Enter your full address"
                    className={`input-field resize-none ${!isEditing ? "bg-background text-text-secondary border-transparent" : ""}`}
                    {...register("address")}
                  ></textarea>
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-border mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                  >
                    <Check size={18} className="mr-2" /> Save Profile Updates
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
