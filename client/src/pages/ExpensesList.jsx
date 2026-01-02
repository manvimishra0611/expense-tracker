import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api.js";
import Loader from "../components/Loader";
import "../styles/expenses.css";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Search (debounced)
  const [search, setSearch] = useState("");
  const searchTimeout = useRef(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      let query = "/api/expenses?page=1&limit=10&sort=-date";
      if (search) query += `&search=${search}`;
      if (categoryFilter) query += `&category=${categoryFilter}`;
      if (fromDate) query += `&from=${fromDate}`;
      if (toDate) query += `&to=${toDate}`;

      const res = await api.get(query);
      setExpenses(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search + filters
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      fetchExpenses();
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [search, categoryFilter, fromDate, toDate]);

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      setLoading(true);
      await api.delete(`/api/expenses/${id}`);
      toast.success("Expense deleted");
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Expenses List</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Bills">Bills</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {loading && <Loader />}
      {!loading && error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          {expenses.length === 0 ? (
            <p>No expenses found</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>{exp.title}</td>
                    <td>₹{exp.amount}</td>
                    <td>
                      <span className={`badge ${exp.category.toLowerCase()}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td>{exp.date?.slice(0, 10)}</td>
                    <td>
                      <Link to={`/edit/${exp._id}`} className="btn link">
                        Edit
                      </Link>
                      <button
                        className="btn danger"
                        onClick={() => handleDelete(exp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Link to="/add" className="btn primary">
          Add New Expense
        </Link>
      </div>
    </div>
  );
};

export default ExpensesList;
