import { Routes, Route } from "react-router-dom";
import ExpensesList from "./pages/ExpensesList";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ExpensesList />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/edit/:id" element={<EditExpense />} />
      </Routes>
    </>
  );
}

export default App;
