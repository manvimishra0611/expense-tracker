import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      style={{
        padding: "12px 20px",
        background: "#1e293b",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2 style={{ margin: 0 }}>Expense Tracker</h2>

      <nav>
        <Link to="/" style={{ color: "#fff", marginRight: 16 }}>
          Home
        </Link>
        <Link to="/add" style={{ color: "#fff" }}>
          Add Expense
        </Link>
      </nav>
    </header>
  );
};

export default Header;
