import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api.js";
import Loader from "../components/Loader";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  // Debounce ref
  const debounceRef = useRef(null);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      let query = "/api/expenses?page=1&limit=10&sort=-date";
      if (categoryFilter) query += `&category=${categoryFilter}`;
      if (fromDate) query += `&from=${fromDate}`;
      if (toDate) query += `&to=${toDate}`;
      if (search) query += `&search=${search}`;

      const res = await api.get(query);
      const data = res.data?.data ?? [];
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses");
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Debounced fetch
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchExpenses();
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [categoryFilter, fromDate, toDate, search]);

  // Delete expense
  const handleDelete = async (_id) => {
    const sure = window.confirm("Are you sure you want to delete this expense?");
    if (!sure) return;

    try {
      setLoading(true);
      await api.delete(`/api/expenses/${_id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== _id));
      toast.success("Expense deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Expenses List</h2>

      {/* Filters + Search */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: 8 }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Utilities">Utilities</option>
          <option value="Transport">Transport</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ marginRight: 8 }}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {loading && <Loader />}

      {!loading && error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {expenses.length === 0 ? (
            <p>No expenses found</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: 10,
                }}
              >
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
                      <td>{exp.category}</td>
                      <td>{exp.date?.slice(0, 10)}</td>
                      <td>
                        <Link to={`/edit/${exp._id}`}>Edit</Link>{" "}
                        |{" "}
                        <button
                          onClick={() => handleDelete(exp._id)}
                          style={{ marginLeft: 8 }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: 12 }}>
        <Link to="/add">Add New Expense</Link>
      </div>
    </div>
  );
};

export default ExpensesList;
