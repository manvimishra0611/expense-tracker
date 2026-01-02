// client/src/pages/AddExpense.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api.js";
import Loader from "../components/Loader";

export default function AddExpense() {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category || !form.date) {
      toast.error("Please fill title, amount, category and date");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/expenses", form);
      toast.success("Expense added successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      {loading && <Loader />}

      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <div>
          <label>Title</label><br />
          <input name="title" value={form.title} onChange={handleChange} />
        </div>

        <div>
          <label>Amount</label><br />
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Category</label><br />
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Date</label><br />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Note</label><br />
          <textarea name="note" value={form.note} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
