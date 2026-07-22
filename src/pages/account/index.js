// pages/account/index.js
import { useState } from 'react';
import { getCustomer } from '@/utils/customer';
import { parseCookie } from 'cookie';

export async function getServerSideProps({ req }) {
  try {
    const cookies = parseCookie(req.headers.cookie || '');
    const token = cookies.customer_token;

    if (!token) {
      return {
        redirect: {
          destination: '/api/account/login',
          permanent: false,
        },
      };
    }

    const { data, errors } = await getCustomer(token);

    if (errors || !data?.customer) {
      return {
        redirect: {
          destination: '/api/account/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        customer: data.customer,
      },
    };
  } catch (err) {
    console.error('Account page error:', err);

    return {
      redirect: {
        destination: '/api/account/login',
        permanent: false,
      },
    };
  }
}

export default function AccountPage({ customer }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/account/address/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.errors || data.data?.customerAddressCreate?.userErrors?.length) {
      alert('Failed to add address');
      console.error(data);
      return;
    }

    window.location.reload();
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    const res = await fetch('/api/account/address/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressId: id }),
    });

    const data = await res.json();

   if (
  data.errors ||
  data.data?.customerAddressDelete?.userErrors?.length
) {
  console.error(data);
  alert(
    data.data?.customerAddressDelete?.userErrors?.[0]?.message ||
      'Failed to delete address'
  );
  return;
}

    window.location.reload();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {customer.firstName || customer.emailAddress.emailAddress}!
      </h1>

      <p className="mb-8">Email: {customer.emailAddress.emailAddress}</p>

      {/* Recent Orders */}
      <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>

      <ul className="mb-10 space-y-2">
        {customer.orders.nodes.map((order) => (
          <li key={order.id} className="border p-3 rounded">
            {order.name} — {order.totalPrice.amount}{' '}
            {order.totalPrice.currencyCode}
          </li>
        ))}
      </ul>

      {/* Address Book */}
      <h2 className="text-2xl font-semibold mb-4">Address Book</h2>

      {/* Existing addresses */}
      <div className="space-y-4 mb-8">
        {customer.addresses.nodes.length === 0 ? (
          <p>No saved addresses yet.</p>
        ) : (
          customer.addresses.nodes.map((address) => (
            <div key={address.id} className="border p-4 rounded">
              <p className="font-semibold">
                {address.firstName} {address.lastName}
              </p>
              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>
                {address.city}, {address.province} {address.zip}
              </p>
              <p>{address.country}</p>
              {address.phoneNumber && <p>{address.phoneNumber}</p>}

              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="mt-3 text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add address form */}
      <h3 className="text-xl font-semibold mb-4">Add New Address</h3>

      <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-3 rounded" required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-3 rounded" required />
        <input name="address1" placeholder="Address Line 1" onChange={handleChange} className="border p-3 rounded md:col-span-2" required />
        <input name="address2" placeholder="Address Line 2 (optional)" onChange={handleChange} className="border p-3 rounded md:col-span-2" />
        <input name="city" placeholder="City" onChange={handleChange} className="border p-3 rounded" required />
        <input name="province" placeholder="State / Province" onChange={handleChange} className="border p-3 rounded" required />
        <input name="zip" placeholder="ZIP / Postal Code" onChange={handleChange} className="border p-3 rounded" required />
        <input name="country" placeholder="Country" onChange={handleChange} className="border p-3 rounded" required />
        <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="border p-3 rounded md:col-span-2" />

        <button type="submit" className="bg-black text-white py-3 rounded md:col-span-2">
          Add Address
        </button>
      </form>
    </div>
  );
}