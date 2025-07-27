import { Link } from "react-router-dom";

function UserManual() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">📘 User Manual</h1>

      <p className="mb-4">
        Welcome to <strong>SnackSource</strong>! Here's how to get started:
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-indigo-600 mb-2">👤 For Raw Material Suppliers</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Register or login as a raw material supplier.</li>
          <li>Enter your city and state during registration to make your products visible to local vendors.</li>
          <li>You can <strong>add raw materials</strong> to the platform and <strong>view/edit previously added materials</strong>.</li>
          <li>Your materials will be visible only to vendors within the same city/state.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-indigo-600 mb-2">🛒 For Vendors</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Register or login as a vendor.</li>
          <li>Enter your city and state to browse raw materials available from local suppliers.</li>
          <li>You can <strong>add products to your cart</strong> and proceed to the <strong>checkout page</strong> to place orders.</li>
          <li>Use filters to browse products based on <strong>price</strong> and <strong>customer ratings</strong>.</li>
        </ul>
      </div>

      <Link to="/" className="text-indigo-600 underline hover:text-indigo-800">
        ⬅️ Back to Home
      </Link>
    </div>
  );
}

export default UserManual;
