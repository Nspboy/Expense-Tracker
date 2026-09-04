import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  DollarSign,
  ChevronRight,
  LogOut,
  Camera,
  Mail,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";

const Settings = () => {
  const {
    user,
    profile,
    theme,
    toggleTheme,
    updateProfile,
    handleLogout,
    fetchProfile,
  } = useAuth();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Internal state for forms
  const [formData, setFormData] = useState({
    email: "",
    profession: "",
    income: 0,
    Savings: 0,
    currency: "USD",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.user?.email || "",
        profession: profile.profession || "",
        income: profile.income || 0,
        Savings: profile.Savings || 0,
        currency: profile.currency || "USD",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        profession: formData.profession,
        income: formData.income,
        Savings: formData.Savings,
        currency: formData.currency,
        user: {
          email: formData.email,
        },
      });
      addToast("Profile updated successfully", "success");
      await fetchProfile();
    } catch (err) {
      console.error(err);
      addToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}
    >
      <div className="dashboard-header" style={{ marginBottom: "48px" }}>
        <div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "900",
              letterSpacing: "-1.5px",
              marginBottom: "8px",
            }}
          >
            Settings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
            Personalize your experience and financial targets.
          </p>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
            className="btn"
            style={{
              width: "auto",
              background: "var(--input-bg)",
              color: "var(--text-main)",
              border: "1px solid var(--border)",
            }}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="btn"
            style={{
              width: "auto",
              background: "var(--danger-soft)",
              color: "var(--danger)",
            }}
          >
            <LogOut size={18} /> Log Out
          </motion.button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "32px",
        }}
      >
        {/* Personal Information */}
        <motion.div
          variants={sectionVariants}
          className="flux-card"
          style={{ gridColumn: "span 1" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                padding: "8px",
                background: "var(--primary-soft)",
                borderRadius: "10px",
                color: "var(--primary)",
              }}
            >
              <User size={20} />
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: "800" }}>
              Personal Info
            </h2>
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              value={user?.username || ""}
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              className="form-input"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Profession</label>
            <select
              name="profession"
              className="form-input"
              value={formData.profession}
              onChange={handleChange}
            >
              <option value="Employee">Employee</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </motion.div>

        {/* Financial Targets */}
        <motion.div
          variants={sectionVariants}
          className="flux-card"
          style={{ gridColumn: "span 1" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                padding: "8px",
                background: "var(--success-soft)",
                borderRadius: "10px",
                color: "var(--success-text)",
              }}
            >
              <DollarSign size={20} />
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: "800" }}>
              Financial Goals
            </h2>
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Income Target</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontWeight: "700",
                  color: "var(--text-muted)",
                }}
              >
                $
              </span>
              <input
                name="income"
                className="form-input"
                type="number"
                value={formData.income}
                onChange={handleChange}
                style={{ paddingLeft: "32px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Savings Target</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontWeight: "700",
                  color: "var(--text-muted)",
                }}
              >
                $
              </span>
              <input
                name="Savings"
                className="form-input"
                type="number"
                value={formData.Savings}
                onChange={handleChange}
                style={{ paddingLeft: "32px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Default Currency</label>
            <select
              name="currency"
              className="form-input"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </motion.div>

        <div
          style={{
            gridColumn: "span 2",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
            type="submit"
            className="btn btn-primary"
            style={{ width: "200px" }}
          >
            {isSaving ? "Saving Changes..." : "Save Settings"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default Settings;
