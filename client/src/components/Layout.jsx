
// client/src/components/Layout.jsx
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/add">Add Expense</Link>
      </nav>
      <main>
        <Outlet /> {/* Nested routes render here */}
      </main>
    </div>
  );
}
