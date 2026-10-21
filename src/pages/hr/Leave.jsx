import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { api } from "../../services/api";
import toast from "react-hot-toast";

export default function HrLeave() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await api.get("/leaveRequests");
      setRequests(
        data.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)),
      );
    } catch (error) {
      toast.error("Failed to load leave requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (request, status) => {
    if (
      window.confirm(
        `Are you sure you want to ${status.toLowerCase()} this request?`,
      )
    ) {
      try {
        await api.put(`/leaveRequests/${request.id}`, { ...request, status });
        toast.success(`Request ${status.toLowerCase()}`);
        fetchRequests();
      } catch (error) {
        toast.error("Failed to update status.");
      }
    }
  };

  return (
    <div className="card">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-text-main">Leave Requests</h2>
          <p className="text-sm text-text-secondary">
            Review and manage employee leave applications
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Leave Details</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Applied On</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-text-secondary"
                >
                  Loading...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-text-secondary"
                >
                  No leave requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-border/50 hover:bg-background/30"
                >
                  <td className="px-6 py-4 font-medium text-text-main">
                    {req.employeeName}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{req.leaveType}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      {new Date(req.startDate).toLocaleDateString()} -{" "}
                      {new Date(req.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-medium text-primary mt-1">
                      {req.daysRequested} Days
                    </p>
                  </td>
                  <td
                    className="px-6 py-4 max-w-xs truncate text-text-secondary"
                    title={req.reason}
                  >
                    {req.reason}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {new Date(req.appliedOn).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-right space-x-2">
                    {req.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => updateStatus(req, "Approved")}
                          className="p-2 cursor-pointer text-success hover:bg-success/10 rounded-lg border border-transparent hover:border-success/20 transition-all"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => updateStatus(req, "Rejected")}
                          className="p-2 cursor-pointer text-error hover:bg-error/10 rounded-lg border border-transparent hover:border-error/20 transition-all"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <span className="text-text-secondary text-xs italic">
                        Reviewed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
