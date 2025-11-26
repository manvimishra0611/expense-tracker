// client/src/pages/ExpensesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api.js";
import Loader from "../components/Loader";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true); // used for fetch + delete
  const [error, setError] = useState("");

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      let query = "/api/expenses?page=1&limit=10&sort=-date";
      if (categoryFilter) query += `&category=${categoryFilter}`;
      if (fromDate) query += `&from=${fromDate}`;
      if (toDate) query += `&to=${toDate}`;

      const res = await api.get(query);
      // expected response { success:true, data:[...], page, pages, total }
      const data = res.data?.data ?? res.data?.expenses ?? res.data ?? [];
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses");
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const handleDelete = async (_id) => {
    const sure = window.confirm("Are you sure you want to delete this expense?");
    if (!sure) return;

    try {
      setLoading(true);
      await api.delete(`/api/expenses/${_id}`);
      // update local state
      setExpenses((prev) => prev.filter((exp) => exp._id !== _id));
      toast.success("Expense deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [categoryFilter, fromDate, toDate]);

  // Example fallback items when API returns empty - optional
  const exampleItems = [
    { _id: "ex1", title: "Groceries", amount: 50, category: "Food", date: "2025-10-10" },
    { _id: "ex2", title: "Electricity Bill", amount: 75, category: "Utilities", date: "2025-10-09" },
    { _id: "ex3", title: "Bus Pass", amount: 30, category: "Transport", date: "2025-10-08" },
  ];

  const listToShow = expenses.length === 0 ? exampleItems : expenses;

  return (
    <div>
      <h2>Expenses List</h2>

      {/* Filters */}
      <div style={{ marginBottom: 10 }}>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* Loader */}
      {loading && <Loader />}

      {/* Table + states */}
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {listToShow.length === 0 ? (
            <p>No expenses found</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table border="1" cellPadding="6" style={{ minWidth: 700 }}>
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
                  {listToShow.map((exp) => (
                    <tr key={exp._id}>
                      <td>{exp.title}</td>
                      <td>₹{exp.amount}</td>
                      <td>{exp.category}</td>
                      <td>{exp.date?.slice(0, 10) ?? ""}</td>
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

