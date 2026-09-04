import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  PieChart,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion as Motion } from "framer-motion";

const Sidebar = () => {
  const { handleLogout, theme, toggleTheme } = useAuth();
  const isDark = theme === "dark";

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/" },
    { icon: <Receipt size={20} />, label: "Transactions", path: "/expenses" },
    { icon: <Wallet size={20} />, label: "Wallet", path: "/wallet" },
    { icon: <Target size={20} />, label: "Goals", path: "/goals" },
    { icon: <PieChart size={20} />, label: "Budget", path: "/budgets" },
    { icon: <BarChart3 size={20} />, label: "Analytics", path: "/analytics" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <aside
      style={{
        width: "260px",
        background: "var(--card-bg)",
        borderRight: "1px solid var(--border)",
        height: "100vh",
        padding: "32px 20px",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px",
          paddingLeft: "8px",
        }}
      >
        <div
          style={{
            background: "var(--text-main)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--card-bg)",
            fontWeight: "900",
            fontSize: "20px",
          }}
        >
          E
        </div>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "800",
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.5px",
            color: "var(--text-main)",
          }}
        >
          Expense <span style={{ color: "var(--primary)" }}>Tracker</span>
        </h2>
      </div>

      {/* Main Nav */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "16px",
              textDecoration: "none",
              color: isActive ? "white" : "var(--text-main)",
              background: isActive ? "var(--primary)" : "transparent",
              fontWeight: isActive ? "700" : "500",
              fontSize: "14px",
              transition: "all 0.2s ease",
              boxShadow: isActive
                ? "0 8px 16px rgba(94, 92, 230, 0.25)"
                : "none",
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginTop: "auto",
          paddingTop: "20px",
        }}
      >
        <NavLink
          to="/help"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "16px",
            textDecoration: "none",
            color: "var(--text-main)",
            fontWeight: "500",
            fontSize: "14px",
          }}
        >
          <HelpCircle size={20} /> Help
        </NavLink>
        <Motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "16px",
            border: "none",
            background: "transparent",
            color: "var(--text-main)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "left",
          }}
        >
          <LogOut size={20} /> Log out
        </Motion.button>

        {/* Theme Toggle Pill */}
        <div
          onClick={toggleTheme}
          style={{
            marginTop: "24px",
            background: "var(--input-bg)",
            padding: "4px",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            position: "relative",
            cursor: "pointer",
            height: "40px",
            border: "1px solid var(--border)",
          }}
        >
          {/* Sliding Background */}
          <Motion.div
            layout
            initial={false}
            animate={{ x: isDark ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
              position: "absolute",
              left: "4px",
              width: "calc(50% - 4px)",
              height: "32px",
              background: "var(--card-bg)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-sm)",
              zIndex: 1,
            }}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              color: !isDark ? "var(--primary)" : "var(--text-muted)",
              transition: "color 0.3s",
            }}
          >
            <Sun size={18} />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              color: isDark ? "var(--primary)" : "var(--text-muted)",
              transition: "color 0.3s",
            }}
          >
            <Moon size={18} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
