import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit2, Trash2, X, AlertCircle } from "lucide-react";
import { api } from "../../services/api";
import toast from "react-hot-toast";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/employees");
      setEmployees(
        data.sort((a, b) => new Date(b.dateJoined) - new Date(a.dateJoined)),
      );
    } catch (error) {
      toast.error("Failed to load employees.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      reset(employee);
    } else {
      setEditingEmployee(null);
      reset({ status: "Active" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
  const existingUsers = await api.get(`/employees?email=${data.email}`);
      const hasEmailConflict = editingEmployee 
        ? existingUsers.some(user => user.id !== editingEmployee.id)
        : existingUsers.length > 0;

      if (hasEmailConflict) {
        toast.error("Email is already registered.");
        setIsLoading(false);
        return;
      }

  if (editingEmployee) {
    // Update existing
    data = {
        ...data,
        avatar: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=7C3AED&color=fff`,
    }
    console.log(data)
    await api.put(`/employees/${editingEmployee.id}`, data);
    toast.success("Employee updated successfully");
  } else {
    // Create new
    const newEmployee = {
      ...data,
      id: Date.now().toString(), 
      dateJoined: data.dateJoined || new Date().toISOString().split("T")[0],
      avatar: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=7C3AED&color=fff`,
    };
    await api.post("/employees", newEmployee);
    toast.success("Employee created successfully");
  }
  
  closeModal();
  fetchEmployees(); 
} catch (error) {
  toast.error("An error occurred while saving.");
  setIsLoading(false);
}
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to deactivate and remove this employee record?",
      )
    ) {
      try {
        const users= await api.get(`/users/?employeeId=${id}`)
        const empId = users[0].id
        await api.delete(`/users/${empId}`);
        await api.delete(`/employees/${id}`);
        toast.success("Employee removed");
        fetchEmployees();
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.department}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary h-5 w-5" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center shrink-0 cursor-pointer"
        >
          <Plus size={20} className="mr-2" /> Add Employee
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase bg-background border-b border-border">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-text-secondary"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-text-secondary"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-border/50 hover:bg-background/30 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center">
                      <img
                        src={emp.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full mr-3 border border-border"
                      />
                      <div>
                        <p className="font-semibold text-text-main">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-text-secondary text-xs">
                          ID: {emp.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {emp.email}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-text-main">
                        {emp.jobTitle}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {emp.department}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          emp.status === "Active"
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openModal(emp)}
                        className="p-2 text-text-secondary cursor-pointer hover:bg-violet-200 hover:text-primary transition-colors bg-background rounded-lg border border-border"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-2 text-text-secondary cursor-pointer hover:bg-rose-200 hover:text-error transition-colors bg-background rounded-lg border border-border"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-main">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button
                onClick={closeModal}
                className="text-text-secondary hover:text-error transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className={`input-field ${errors.firstName ? "border-error" : ""}`}
                    {...register("firstName", { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={`input-field ${errors.lastName ? "border-error" : ""}`}
                    {...register("lastName", { required: true })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`input-field ${errors.email ? "border-error" : ""}`}
                    {...register("email", { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department
                  </label>
                  <select
                    className={`input-field bg-white ${errors.department ? "border-error" : ""}`}
                    {...register("department", { required: true })}
                  >
                    <option value="">Select...</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className={`input-field ${errors.jobTitle ? "border-error" : ""}`}
                    {...register("jobTitle", { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    className="input-field bg-white"
                    {...register("status")}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date Joined
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    {...register("dateJoined")}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingEmployee ? "Save Changes" : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
