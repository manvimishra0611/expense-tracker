const Footer = () => {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: "12px",
        textAlign: "center",
        background: "#f1f5f9",
        color: "#555"
      }}
    >
      © {new Date().getFullYear()} Expense Tracker
    </footer>
  );
};

export default Footer;
