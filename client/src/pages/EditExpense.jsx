// client/src/pages/EditExpense.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api.js";
import Loader from "../components/Loader";

export default function EditExpense() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: ""
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const loadExpense = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/expenses/${id}`);
      // backend might return { success:true, data: { ... } }
      const d = res.data?.data ?? res.data?.expense ?? res.data;
      setForm({
        title: d.title || "",
        amount: d.amount || "",
        category: d.category || "",
        date: (d.date || "").slice(0,10),
        note: d.note || ""
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load expense");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.put(`/api/expenses/${id}`, form);
      toast.success("Expense updated successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Edit Expense</h2>
      {loading && <Loader />}

      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <div>
          <label>Title</label><br />
          <input name="title" value={form.title} onChange={handleChange} />
        </div>

        <div>
          <label>Amount</label><br />
          <input name="amount" type="number" value={form.amount} onChange={handleChange} />
        </div>

        <div>
          <label>Category</label><br />
          <input name="category" value={form.category} onChange={handleChange} />
        </div>

        <div>
          <label>Date</label><br />
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </div>

        <div>
          <label>Note</label><br />
          <textarea name="note" value={form.note} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
