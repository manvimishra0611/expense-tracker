import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import ExpensesList from "./pages/ExpensesList";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";

function App() {
  return (
    <>
      {/* HEADER */}
      <Header />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<ExpensesList />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/edit/:id" element={<EditExpense />} />
      </Routes>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default App;
