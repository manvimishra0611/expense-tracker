import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        padding: "12px 20px",
        background: "#1e293b",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>Expense Tracker</h2>

      <nav>
        {!isAuthenticated ? (
          <Link to="/login" style={{ color: "#fff" }}>
            Login
          </Link>
        ) : (
          <>
            <Link to="/" style={{ color: "#fff", marginRight: 16 }}>
              Home
            </Link>
            <Link to="/add" style={{ color: "#fff", marginRight: 16 }}>
              Add Expense
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid #fff",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
