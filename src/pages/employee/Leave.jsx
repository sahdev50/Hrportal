import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, AlertCircle, Trash2 } from "lucide-react";
import { differenceInBusinessDays, parseISO } from "date-fns";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function EmployeeLeave() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const fetchLeaves = async () => {
    try {
      const data = await api.get(
        `/leaveRequests?employeeId=${user.profile.id}`,
      );
      setLeaveRequests(
        data.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)),
      );
    } catch (error) {
      toast.error("Failed to load leave history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.profile?.id) fetchLeaves();
  }, [user]);

  const onSubmit = async (data) => {
    const days =
      differenceInBusinessDays(
        parseISO(data.endDate),
        parseISO(data.startDate),
      ) + 1;

    if (days <= 0) {
      toast.error("End date must be after start date.");
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      employeeId: user.profile.id,
      employeeName: `${user.profile.firstName} ${user.profile.lastName}`,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      daysRequested: days,
      reason: data.reason,
      status: "Pending",
      appliedOn: new Date().toISOString(),
    };

    try {
      await api.post("/leaveRequests", newRequest);
      toast.success("Leave request submitted successfully.");
      reset();
      fetchLeaves();
    } catch (error) {
      toast.error("Failed to submit request.");
    }
  };

  const cancelRequest = async (id) => {
    if (window.confirm("Cancel this pending leave request?")) {
      try {
        await api.delete(`/leaveRequests/${id}`);
        toast.success("Request cancelled.");
        fetchLeaves();
      } catch (error) {
        toast.error("Failed to cancel request.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Submit Form */}
      <div className="lg:col-span-1">
        <div className="card sticky top-24">
          <h2 className="text-xl font-bold text-text-main mb-6 flex items-center">
            <CalendarDays className="mr-2 text-primary" /> Request Leave
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Leave Type
              </label>
              <select
                className={`input-field bg-white ${errors.leaveType ? "border-error" : ""}`}
                {...register("leaveType", { required: true })}
              >
                <option value="">Select type...</option>
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Personal">Personal Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className={`input-field ${errors.startDate ? "border-error" : ""}`}
                  {...register("startDate", { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className={`input-field ${errors.endDate ? "border-error" : ""}`}
                  {...register("endDate", { required: true })}
                />
              </div>
            </div>

            {startDate &&
              endDate &&
              differenceInBusinessDays(parseISO(endDate), parseISO(startDate)) +
                1 >
                0 && (
                <div className="bg-primary-light/50 p-3 rounded-xl border border-primary-light text-sm text-primary-deep flex items-start">
                  <AlertCircle size={16} className="mr-2 mt-0.5 shrink-0" />
                  <p>
                    You are requesting{" "}
                    <strong>
                      {differenceInBusinessDays(
                        parseISO(endDate),
                        parseISO(startDate),
                      ) + 1}
                    </strong>{" "}
                    working days.
                  </p>
                </div>
              )}

            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea
                rows="3"
                className={`input-field resize-none ${errors.reason ? "border-error" : ""}`}
                placeholder="Briefly explain your reason..."
                {...register("reason", { required: true })}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full">
              Submit Request
            </button>
          </form>
        </div>
      </div>

      {/* History */}
      <div className="lg:col-span-2">
        <div className="card h-full">
          <h2 className="text-xl font-bold text-text-main mb-6">
            My Leave History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Days</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-text-secondary"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : leaveRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-text-secondary"
                    >
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-border/50 hover:bg-background/30"
                    >
                      <td className="px-4 py-4 font-medium">{req.leaveType}</td>
                      <td className="px-4 py-4 text-text-secondary">
                        {new Date(req.startDate).toLocaleDateString()} -{" "}
                        {new Date(req.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">{req.daysRequested}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            req.status === "Approved"
                              ? "bg-success/10 text-success"
                              : req.status === "Rejected"
                                ? "bg-error/10 text-error"
                                : "bg-warning/10 text-warning"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {req.status === "Pending" && (
                          <button
                            onClick={() => cancelRequest(req.id)}
                            className="text-text-secondary hover:text-error transition-colors p-2"
                            title="Cancel Request"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
