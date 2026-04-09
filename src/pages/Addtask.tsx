import React, { useState, useEffect, useRef, useCallback } from "react";
import { getToken } from "../utils/auth";
import Notification, {
  type NotificationType,
} from "../components/Notification";

interface CustomerOption {
  _id: string;
  name: string;
  phoneNumber: string;
  customerName?: string;
  phoneNumber1?: string;
}

interface Staff {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
}

interface PaymentField {
  method: string;
  amount: string | number;
  isPaid?: boolean;
}

interface FormData {
  entryDate: string;
  customerName: string;
  phoneNumber1: string;
  workDetail: string;
  assignedStaff: string;
  submitDate: string;
  approvedDate: string;
  advanceIn: PaymentField;
  expenseOut: PaymentField;
  balance: PaymentField;
  serviceCharge: PaymentField;
  outstanding: PaymentField;
}

interface FormErrors {
  customerName?: string;
  phone1?: string;
  workDetail?: string;
  assignedStaff?: string;
}

const CustomerForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const [calculatedBalance, setCalculatedBalance] = useState(0);
  const [calculatedOutstanding, setCalculatedOutstanding] = useState(0);

  // Add Customer Modal State
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [addCustomerFormData, setAddCustomerFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [addCustomerErrors, setAddCustomerErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const addCustomerNameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    entryDate: new Date().toISOString().split("T")[0],
    customerName: "",
    phoneNumber1: "",
    workDetail: "",
    assignedStaff: "",
    submitDate: "",
    approvedDate: "",
    advanceIn: { method: "", amount: "" },
    expenseOut: { method: "", amount: "" },
    balance: { method: "", amount: "", isPaid: false },
    serviceCharge: { method: "", amount: "" },
    outstanding: { method: "", amount: "", isPaid: false },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerOption[]>(
    [],
  );
  const [isPettyCash, setIsPettyCash] = useState(false);
  const customerFieldRef = useRef<HTMLDivElement>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);

  // Calculate balance and outstanding: (Expense Out + Service Charge) - Advance In
  useEffect(() => {
    const advanceInAmount = parseFloat(String(formData.advanceIn.amount)) || 0;
    const expenseOutAmount =
      parseFloat(String(formData.expenseOut.amount)) || 0;
    const serviceChargeAmount =
      parseFloat(String(formData.serviceCharge.amount)) || 0;

    const calculatedValue =
      expenseOutAmount + serviceChargeAmount - advanceInAmount;
    const safeValue = isNaN(calculatedValue) ? 0 : calculatedValue;

    // Split into Balance and Outstanding based on sign
    if (safeValue >= 0) {
      // Positive: amount to be paid (Balance)
      setCalculatedBalance(safeValue);
      setCalculatedOutstanding(0);
    } else {
      // Negative: extra amount paid (Outstanding)
      setCalculatedBalance(0);
      setCalculatedOutstanding(Math.abs(safeValue));
    }
  }, [
    formData.advanceIn.amount,
    formData.expenseOut.amount,
    formData.serviceCharge.amount,
    isPettyCash,
  ]);

  useEffect(() => {
    const fetchStaffList = async () => {
      setIsLoadingStaff(true);
      try {
        const token = getToken();
        if (!token) {
          setNotification({
            message: "Authentication required. Please log in again.",
            type: "error",
          });
          setIsLoadingStaff(false);
          return;
        }

        const response = await fetch("/api/staff", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error(`Failed to fetch staff (Status: ${response.status})`);

        const data = await response.json();
        setStaffList(data.staff || []);
      } catch (error) {
        console.error("Error fetching staff:", error);
        setNotification({
          message:
            error instanceof Error
              ? error.message
              : "Failed to load staff list",
          type: "error",
        });
        setStaffList([]);
      } finally {
        setIsLoadingStaff(false);
      }
    };
    fetchStaffList();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.warn("No token found for customer fetch");
          return;
        }

        const response = await fetch("/api/customer-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Customers fetched:", data);

          // Handle different response formats
          const customersList = data.customers || data.data || data || [];
          setCustomers(Array.isArray(customersList) ? customersList : []);
        } else {
          console.warn(
            "Customer fetch returned non-ok status:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const query = formData.customerName?.trim() || "";
    if (query) {
      const normalized = query.toLowerCase();
      const filtered = customers.filter((customer) => {
        const custName = customer.name || customer.customerName || "";
        const custPhone = customer.phoneNumber || customer.phoneNumber1 || "";
        const nameMatch = custName.toLowerCase().includes(normalized);
        const phoneMatch = custPhone.includes(query);
        return nameMatch || phoneMatch;
      });
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [formData.customerName, customers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customerFieldRef.current &&
        !customerFieldRef.current.contains(event.target as Node)
      ) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add Customer Modal Handlers
  const openAddCustomerModal = useCallback(() => {
    setIsAddCustomerModalOpen(true);
    // Autofocus the name input when modal opens
    setTimeout(() => {
      addCustomerNameInputRef.current?.focus();
    }, 100);
  }, []);

  const closeAddCustomerModal = () => {
    setIsAddCustomerModalOpen(false);
    setAddCustomerFormData({
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
    });
    setAddCustomerErrors({});
  };

  const validateAddCustomerForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addCustomerFormData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!addCustomerFormData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (addCustomerFormData.phoneNumber.trim().length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    if (
      addCustomerFormData.email &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        addCustomerFormData.email,
      )
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    setAddCustomerErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    // Format phone number - digits only, max 10 chars
    if (name === "phoneNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setAddCustomerFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error for this field as user types
    if (addCustomerErrors[name]) {
      setAddCustomerErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAddCustomerForm()) {
      return;
    }

    setIsAddingCustomer(true);

    try {
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found. Please log in again.",
          type: "error",
        });
        setIsAddingCustomer(false);
        return;
      }

      const response = await fetch("/api/customer-info", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: addCustomerFormData.name.trim(),
          phoneNumber: addCustomerFormData.phoneNumber.trim(),
          email: addCustomerFormData.email.trim() || undefined,
          address: addCustomerFormData.address.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle duplicate email error - set it as field error
        if (
          errorData.field === "email" ||
          errorData.message?.includes("Email")
        ) {
          setAddCustomerErrors((prev) => ({
            ...prev,
            email: errorData.message,
          }));
          setIsAddingCustomer(false);
          return;
        }

        throw new Error(
          errorData.message ||
            `Failed to add customer (Status: ${response.status})`,
        );
      }

      const data = await response.json();
      const newCustomer = data.customer || data.data;

      if (newCustomer) {
        // Add to customers list
        const customerToAdd: CustomerOption = {
          _id: newCustomer._id || newCustomer.id,
          name: newCustomer.name,
          phoneNumber: newCustomer.phoneNumber,
        };

        setCustomers((prev) => [customerToAdd, ...prev]);

        // Auto-select the newly added customer in the Add Task form
        setSelectedCustomer(customerToAdd);
        setFormData((prev) => ({
          ...prev,
          customerName: customerToAdd.name,
          phoneNumber1: customerToAdd.phoneNumber,
        }));

        // Show success notification
        setNotification({
          message: "Customer added successfully!",
          type: "success",
        });

        // Close modal
        closeAddCustomerModal();
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      setNotification({
        message:
          error instanceof Error ? error.message : "Failed to add customer",
        type: "error",
      });
    } finally {
      setIsAddingCustomer(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isPettyCash) {
      if (!selectedCustomer) {
        newErrors.customerName = "Please select a customer from the list";
      }
    }

    if (formData.phoneNumber1.trim()) {
      if (formData.phoneNumber1.trim().length !== 10) {
        newErrors.phone1 = "Phone number must be exactly 10 digits";
      }
    } else if (!isPettyCash) {
      newErrors.phone1 = "Phone number is required";
    }

    if (!formData.assignedStaff) {
      newErrors.assignedStaff = "Please select a staff member";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    // Restrict phone number to digits only and maximum 10 characters
    if (name === "phoneNumber1") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === "phoneNumber1" && selectedCustomer) {
      const selectedPhone =
        selectedCustomer.phoneNumber || selectedCustomer.phoneNumber1 || "";
      if (newValue.trim() !== selectedPhone.trim()) {
        setSelectedCustomer(null);
      }
    }

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (isPettyCash) {
      setFormData((prev) => ({
        ...prev,
        customerName: value,
      }));
      setSelectedCustomer(null);
      setShowCustomerDropdown(false);
      if (errors.customerName) {
        setErrors((prev) => ({ ...prev, customerName: undefined }));
      }
      return;
    }

    const selectedName =
      selectedCustomer?.name || selectedCustomer?.customerName || "";
    const shouldClearSelection =
      !!selectedCustomer && value.trim() !== selectedName.trim();

    // Update the search field for dropdown filtering
    setFormData((prev) => ({
      ...prev,
      customerName: value,
      phoneNumber1:
        value.trim() === "" || shouldClearSelection ? "" : prev.phoneNumber1,
    }));

    // Show dropdown to let user select from filtered list
    setShowCustomerDropdown(value.length > 0);

    if (value.trim() === "" || shouldClearSelection) {
      setSelectedCustomer(null);
    }
  };

  const handleCustomerSelect = (customer: CustomerOption) => {
    setSelectedCustomer(customer);
    setFormData((prev) => ({
      ...prev,
      customerName: customer.name || customer.customerName || "",
      phoneNumber1: customer.phoneNumber || customer.phoneNumber1 || "",
    }));

    setErrors((prev) => ({
      ...prev,
      customerName: undefined,
      phone1: undefined,
    }));
    setShowCustomerDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification({
        message: "Please fill all the feilds",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();
      if (!token) {
        setNotification({
          message: "Authentication token not found. Please log in again.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      const buildPaymentField = (field: PaymentField) => {
        if (!field.method && !field.amount) return undefined;
        return {
          method: field.method || null,
          amount: field.amount ? parseFloat(String(field.amount)) : null,
        };
      };

      const buildBalancePayload = () => {
        if (isPettyCash) {
          return buildPaymentField(formData.balance);
        }
        return {
          method: formData.balance.method || null,
          amount: calculatedBalance > 0 ? calculatedBalance : null,
          isPaid: calculatedBalance > 0 ? false : true,
        };
      };

      const buildOutstandingPayload = () => {
        if (isPettyCash) {
          return buildPaymentField(formData.outstanding);
        }
        return {
          method: formData.outstanding.method || null,
          amount: calculatedOutstanding > 0 ? calculatedOutstanding : null,
          isPaid: calculatedOutstanding > 0 ? false : true,
        };
      };

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryDate: formData.entryDate,
          customerName: formData.customerName.trim(),
          phoneNumber1: formData.phoneNumber1.trim(),
          workDetail: formData.workDetail.trim(),
          assignedStaff: formData.assignedStaff,
          submitDate: formData.submitDate || undefined,
          approvedDate: formData.approvedDate || undefined,
          isPettyCash,
          advanceIn: buildPaymentField(formData.advanceIn),
          expenseOut: buildPaymentField(formData.expenseOut),
          balance: buildBalancePayload(),
          outstanding: buildOutstandingPayload(),
          serviceCharge: buildPaymentField(formData.serviceCharge),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to add task (Status: ${response.status})`,
        );
      }

      const data = await response.json();
      console.log("Task added successfully:", data);

      setNotification({ message: "Task added successfully!", type: "success" });
      setFormData({
        entryDate: new Date().toISOString().split("T")[0],
        customerName: "",
        phoneNumber1: "",
        workDetail: "",
        assignedStaff: "",
        submitDate: "",
        approvedDate: "",
        advanceIn: { method: "", amount: "" },
        expenseOut: { method: "", amount: "" },
        balance: { method: "", amount: "" },
        serviceCharge: { method: "", amount: "" },
        outstanding: { method: "", amount: "" },
      });
    } catch (error) {
      console.error("Error adding task:", error);
      setNotification({
        message: error instanceof Error ? error.message : "Failed to add task",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentFieldChange = (
    fieldName:
      | "advanceIn"
      | "expenseOut"
      | "balance"
      | "serviceCharge"
      | "outstanding",
    subField: "method" | "amount",
    value: string | number,
  ) => {
    setFormData((prev) => {
      const updatedField = {
        ...prev[fieldName],
        [subField]: subField === "amount" ? (value === "" ? "" : value) : value,
      };

      // If amount is being set to empty/0, reset method to empty
      if (subField === "amount" && (!value || Number(value) === 0)) {
        updatedField.method = "";
      }

      return {
        ...prev,
        [fieldName]: updatedField,
      };
    });
  };

  // Helper function to check if amount is valid (> 0)
  const isAmountValid = (amount: string | number): boolean => {
    if (!amount || amount === "") return false;
    const numAmount = Number(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };

  const handleReset = () => {
    setFormData({
      entryDate: new Date().toISOString().split("T")[0],
      customerName: "",
      phoneNumber1: "",
      workDetail: "",
      assignedStaff: "",
      submitDate: "",
      approvedDate: "",
      advanceIn: { method: "", amount: "" },
      expenseOut: { method: "", amount: "" },
      balance: { method: "", amount: "", isPaid: false },
      serviceCharge: { method: "", amount: "" },
      outstanding: { method: "", amount: "", isPaid: false },
    });
    setErrors({});
    setSelectedCustomer(null);
  };

  const handleModeSwitch = () => {
    // Reset only payment and customer fields when switching modes, keep entryDate
    setFormData((prev) => ({
      ...prev,
      customerName: "",
      phoneNumber1: "",
      workDetail: "",
      assignedStaff: "",
      submitDate: "",
      approvedDate: "",
      advanceIn: { method: "", amount: "" },
      expenseOut: { method: "", amount: "" },
      balance: { method: "", amount: "", isPaid: false },
      serviceCharge: { method: "", amount: "" },
      outstanding: { method: "", amount: "", isPaid: false },
    }));
    setSelectedCustomer(null);
    setShowCustomerDropdown(false);
    setErrors({});
    setCalculatedBalance(0);
    setCalculatedOutstanding(0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 font-sans">
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">
              {isPettyCash ? "Add Petty Cash" : "Add New Task"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isPettyCash
                ? "Record a new petty cash transaction"
                : "Create a new service task for your customer"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="inline-flex rounded-full bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsPettyCash(false);
                  handleModeSwitch();
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform ${
                  !isPettyCash
                    ? "bg-white text-slate-900 shadow-sm scale-105"
                    : "text-slate-500 hover:bg-slate-200 hover:scale-105"
                }`}
              >
                Regular
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPettyCash(true);
                  handleModeSwitch();
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform ${
                  isPettyCash
                    ? "bg-[#001A39] text-white shadow-sm scale-105"
                    : "text-slate-500 hover:bg-slate-200 hover:scale-105"
                }`}
              >
                Petty Cash
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#1e293b] text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              )}
              Create Task
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out">
          {/* Left Column - Task Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-sm">
                    #
                  </span>
                  Task Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Define task details and customer info
                </p>
              </div>

              <div className="space-y-6">
                {/* Customer Name / Search */}
                <div ref={customerFieldRef} className="relative">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    {isPettyCash ? (
                      <>
                        Customer Name{" "}
                        <span className="text-slate-400">(optional)</span>
                      </>
                    ) : (
                      <>
                        Search Existing Customers{" "}
                        <span className="text-red-500">*</span>
                      </>
                    )}
                  </label>

                  <input
                    ref={customerInputRef}
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleCustomerInputChange}
                    onFocus={() => {
                      if (!isPettyCash) setShowCustomerDropdown(true);
                    }}
                    placeholder={
                      isPettyCash
                        ? "Customer name (optional)..."
                        : "Search existing customers..."
                    }
                    autoComplete="off"
                    disabled={isSubmitting}
                    maxLength={100}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 transition-colors ${
                      errors.customerName
                        ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                        : "border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white"
                    }`}
                  />

                  {errors.customerName ? (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {errors.customerName}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      {isPettyCash
                        ? "Type a customer name if available. This is optional."
                        : "Search existing customers or add a new one."}
                    </p>
                  )}

                  {/* Dropdown with Sticky Add Button */}
                  {!isPettyCash && showCustomerDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                      {/* Sticky Add Customer Button at Top */}
                      <button
                        type="button"
                        onClick={openAddCustomerModal}
                        disabled={isSubmitting}
                        className="sticky top-0 w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 border-b-2 border-blue-200 text-blue-700 font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                        title="Add a new customer"
                      >
                        + Add New Customer
                      </button>

                      {/* Customer List */}
                      <div className="overflow-y-auto">
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => {
                            const displayName =
                              customer.name ||
                              customer.customerName ||
                              "Unknown";
                            const displayPhone =
                              customer.phoneNumber ||
                              customer.phoneNumber1 ||
                              "No Phone";
                            return (
                              <div
                                key={customer._id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleCustomerSelect(customer);
                                }}
                                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
                              >
                                <div className="font-medium text-slate-800 text-sm">
                                  {displayName}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {displayPhone}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-4 py-3 text-center text-slate-500 text-sm">
                            No customers found. Click button above to add a new
                            one.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <span className="text-xs text-slate-400">
                      10 digits required
                    </span>
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber1"
                    value={formData.phoneNumber1}
                    onChange={handleChange}
                    placeholder="9876543210"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 transition-colors ${
                      errors.phone1
                        ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                        : "border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white"
                    }`}
                  />
                  {errors.phone1 ? (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {errors.phone1}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Numbers only
                    </p>
                  )}
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Entry Date
                    </label>
                    <input
                      type="date"
                      name="entryDate"
                      value={formData.entryDate}
                      onChange={handleChange}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => e.preventDefault()}
                      onKeyDown={(e) => e.preventDefault()}
                      readOnly
                      disabled={isSubmitting}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  {!isPettyCash && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Submit Date
                        </label>
                        <input
                          type="date"
                          name="submitDate"
                          value={formData.submitDate}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Approved Date
                        </label>
                        <input
                          type="date"
                          name="approvedDate"
                          value={formData.approvedDate}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* --- PAYMENT INFORMATION UI UPGRADED HERE --- */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 mt-6">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-sm flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  Payment Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Optional: Add payment details (cash or GPay)
                </p>
              </div>

              {/* Converted to a 2x2 grid instead of vertical stacking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Advance In Card */}
                <div className="relative border border-slate-200 rounded-xl p-5 bg-white hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full  opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <label className="block text-sm font-bold text-slate-800 mb-4">
                    Advance In
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.advanceIn.amount}
                        onChange={(e) =>
                          handlePaymentFieldChange(
                            "advanceIn",
                            "amount",
                            e.target.value,
                          )
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none  "
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Method
                      </label>
                      <select
                        value={formData.advanceIn.method}
                        onChange={(e) =>
                          handlePaymentFieldChange(
                            "advanceIn",
                            "method",
                            e.target.value,
                          )
                        }
                        disabled={
                          isSubmitting ||
                          !isAmountValid(formData.advanceIn.amount)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none bg-slate-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        <option value="">Select</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Expense Out Card */}
                <div className="relative border border-slate-200 rounded-xl p-5 bg-white hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <label className="block text-sm font-bold text-slate-800 mb-4">
                    Expense Out
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.expenseOut.amount}
                        onChange={(e) =>
                          handlePaymentFieldChange(
                            "expenseOut",
                            "amount",
                            e.target.value,
                          )
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none  bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Method
                      </label>
                      <select
                        value={formData.expenseOut.method}
                        onChange={(e) =>
                          handlePaymentFieldChange(
                            "expenseOut",
                            "method",
                            e.target.value,
                          )
                        }
                        disabled={
                          isSubmitting ||
                          !isAmountValid(formData.expenseOut.amount)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none  bg-slate-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        <option value="">Select</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Balance Card */}

                {/* Outstanding Card */}

                {/* Service Charge Card */}
                <div className="relative border border-slate-200 rounded-xl p-5 bg-white hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full  opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <label className="block text-sm font-bold text-slate-800 mb-4">
                    Service Charge
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.serviceCharge.amount}
                        onChange={(e) =>
                          handlePaymentFieldChange(
                            "serviceCharge",
                            "amount",
                            e.target.value,
                          )
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none  bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Method
                      </label>
                      <select
                        value={formData.serviceCharge.method}
                        onChange={(e) =>
                          handlePaymentFieldChange(
                            "serviceCharge",
                            "method",
                            e.target.value,
                          )
                        }
                        disabled={
                          isSubmitting ||
                          !isAmountValid(formData.serviceCharge.amount)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none bg-slate-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                      >
                        <option value="">Select</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                      </select>
                    </div>
                  </div>
                </div>

                {calculatedBalance === 0 &&
                  calculatedOutstanding === 0 &&
                  (isAmountValid(formData.advanceIn.amount) ||
                    isAmountValid(formData.expenseOut.amount) ||
                    isAmountValid(formData.serviceCharge.amount)) && (
                    <div className="relative border-2 border-emerald-300 rounded-xl p-5 bg-emerald-50 hover:shadow-sm transition-all overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <label className="block text-sm font-bold text-emerald-700 mb-4">
                        Payment Completed
                      </label>
                      <p className="text-sm text-emerald-700">
                        The entered amounts are balanced and no amount is due.
                      </p>
                    </div>
                  )}

                {calculatedOutstanding > 0 && (
                  <div className="relative border-2 border-green-300 rounded-xl p-5 bg-green-50 hover:shadow-sm transition-all overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <label className="block text-sm font-bold text-green-700 mb-4">
                      Outstanding (Extra Paid)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-green-600 uppercase tracking-wider mb-1.5">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={calculatedOutstanding}
                          placeholder="0.00"
                          step="0.01"
                          readOnly
                          disabled
                          className="w-full px-3 py-2 rounded-lg border-2 border-green-300 text-sm focus:outline-none bg-green-100 cursor-not-allowed text-green-700 font-bold transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-green-600 uppercase tracking-wider mb-1.5">
                          Method
                        </label>
                        <select
                          onChange={(e) =>
                            handlePaymentFieldChange(
                              "outstanding",
                              "method",
                              e.target.value,
                            )
                          }
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 rounded-lg border border-green-300 text-sm focus:outline-none bg-white transition-colors opacity-50 "
                        >
                          <option value="">Select</option>
                          <option value="cash">Cash</option>
                          <option value="bank">Bank</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {calculatedBalance > 0 && (
                  <div className="relative border-2 border-red-300 rounded-xl p-5 bg-red-50 hover:shadow-sm transition-all overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <label className="block text-sm font-bold text-red-700 mb-4">
                      Amount Due
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-red-600 uppercase tracking-wider mb-1.5">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={calculatedBalance}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 rounded-lg border-2 border-red-300 text-sm focus:outline-none bg-red-100 cursor-not-allowed text-red-700 font-bold transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-red-600 uppercase tracking-wider mb-1.5">
                          Method
                        </label>
                        <select
                          value={formData.balance.method}
                          onChange={(e) =>
                            handlePaymentFieldChange(
                              "balance",
                              "method",
                              e.target.value,
                            )
                          }
                          disabled={
                            isSubmitting
                            // !isAmountValid(formData.balance.amount)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-red-300 text-sm focus:outline-none bg-white focus:ring-1 focus:ring-red-500 transition-colors"
                        >
                          <option value="">Select</option>
                          <option value="cash">Cash</option>
                          <option value="bank">Bank</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Work Details & Assignment */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-sm flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  Task Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Assign staff and detail the work
                </p>
              </div>

              <div className="space-y-6">
                {/* Staff Assignment */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Assign Staff
                    </label>
                  </div>
                  <select
                    name="assignedStaff"
                    value={formData.assignedStaff}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoadingStaff}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm appearance-none focus:outline-none focus:ring-1 transition-colors bg-white bg-no-repeat bg-[position:right_1rem_center] bg-[size:1em_1em] ${
                      errors.assignedStaff
                        ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                        : "border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    }}
                  >
                    <option value="" className="text-slate-500">
                      {isLoadingStaff
                        ? "Loading staff..."
                        : "Select a staff member"}
                    </option>
                    {staffList.map((staff) => (
                      <option
                        key={staff._id}
                        value={staff._id}
                        className="text-slate-900"
                      >
                        {staff.fullname}
                      </option>
                    ))}
                  </select>
                  {errors.assignedStaff ? (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {errors.assignedStaff}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Staff required
                    </p>
                  )}
                </div>

                {/* Work Detail */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Work Description
                    </label>
                  </div>
                  <textarea
                    name="workDetail"
                    value={formData.workDetail}
                    onChange={handleChange}
                    placeholder="Describe the task in detail..."
                    rows={6}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white resize-none"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Provide any necessary service notes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Add Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Add New Customer
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Quickly add and select a customer
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddCustomerModal}
                disabled={isAddingCustomer}
                className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddCustomerSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  ref={addCustomerNameInputRef}
                  name="name"
                  value={addCustomerFormData.name}
                  onChange={handleAddCustomerInputChange}
                  placeholder="e.g., John Doe"
                  disabled={isAddingCustomer}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 transition-colors ${
                    addCustomerErrors.name
                      ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white"
                  }`}
                />
                {addCustomerErrors.name && (
                  <p className="mt-1 text-xs text-orange-600">
                    {addCustomerErrors.name}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={addCustomerFormData.phoneNumber}
                  onChange={handleAddCustomerInputChange}
                  placeholder="9876543210"
                  disabled={isAddingCustomer}
                  maxLength={10}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 transition-colors ${
                    addCustomerErrors.phoneNumber
                      ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white"
                  }`}
                />
                {addCustomerErrors.phoneNumber && (
                  <p className="mt-1 text-xs text-orange-600">
                    {addCustomerErrors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={addCustomerFormData.email}
                  onChange={handleAddCustomerInputChange}
                  placeholder="john@example.com"
                  disabled={isAddingCustomer}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 transition-colors ${
                    addCustomerErrors.email
                      ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white"
                  }`}
                />
                {addCustomerErrors.email && (
                  <p className="mt-1 text-xs text-orange-600">
                    {addCustomerErrors.email}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Address
                </label>
                <textarea
                  name="address"
                  value={addCustomerFormData.address}
                  onChange={handleAddCustomerInputChange}
                  placeholder="Enter customer's address (optional)"
                  rows={3}
                  disabled={isAddingCustomer}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddCustomerModal}
                  disabled={isAddingCustomer}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingCustomer}
                  className="flex-1 px-4 py-2.5 bg-[#001A39] text-white text-sm font-medium rounded-lg hover:bg-[#021f43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAddingCustomer ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="white"
                          strokeWidth="2"
                          opacity="0.25"
                        />
                        <path
                          fill="white"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          opacity="0.75"
                        />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.5 1.5H9.5V9H1.5V10.5H9.5V18.5H10.5V10.5H18.5V9H10.5V1.5Z" />
                      </svg>
                      Add Customer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.type === "success" ? 3000 : 5000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default CustomerForm;
