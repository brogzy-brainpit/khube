// pages/account/index.js
import { useState } from 'react';
import { getCustomer } from '@/utils/customer';
import { parseCookie } from 'cookie';
import {
  CountrySelect,
  StateSelect,
} from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';



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
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    zoneCode: '',
    zip: '',
    territoryCode: '',
    phoneNumber: '',
  });

  const handleEditClick = (address) => {
    setEditingId(address.id);
    setEditForm({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      address1: address.address1 || '',
      address2: address.address2 || '',
      city: address.city || '',
      zoneCode: address.zoneCode || '',
      zip: address.zip || '',
      territoryCode: address.territoryCode || '',
      phoneNumber: address.phoneNumber || '',
    });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/account/address/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingId,
        address: editForm,
      }),
    });

    const data = await res.json();

    if (
      data.errors ||
      data.data?.customerAddressUpdate?.userErrors?.length
    ) {
      alert(
        data.data?.customerAddressUpdate?.userErrors?.[0]?.message ||
          'Failed to update address'
      );
      return;
    }

    setEditingId(null);
    window.location.reload();
  };

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

    if (
      data.errors ||
      data.data?.customerAddressCreate?.userErrors?.length
    ) {
      alert(
        data.data?.customerAddressCreate?.userErrors?.[0]?.message ||
          'Failed to add address'
      );
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

  const handleSetDefault = async (addressId) => {
    await fetch('/api/account/address/set-default', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressId }),
    });

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

      <div className="space-y-4 mb-8">
        {customer.addresses.nodes.map((address) =>
          editingId === address.id ? (
            <form
              key={address.id}
              onSubmit={handleUpdateAddress}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-4 rounded"
            >
              <input
                name="firstName"
                value={editForm.firstName}
                onChange={(e) =>
                  setEditForm({ ...editForm, firstName: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                name="lastName"
                value={editForm.lastName}
                onChange={(e) =>
                  setEditForm({ ...editForm, lastName: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                name="address1"
                value={editForm.address1}
                onChange={(e) =>
                  setEditForm({ ...editForm, address1: e.target.value })
                }
                className="border p-2 rounded md:col-span-2"
              />

              <input
                name="address2"
                value={editForm.address2}
                onChange={(e) =>
                  setEditForm({ ...editForm, address2: e.target.value })
                }
                className="border p-2 rounded md:col-span-2"
              />

              <input
                name="city"
                value={editForm.city}
                onChange={(e) =>
                  setEditForm({ ...editForm, city: e.target.value })
                }
                className="border p-2 rounded"
              />

              <CountrySelect
                value={editForm.territoryCode}
                onChange={(country) =>
                  setEditForm({
                    ...editForm,
                    territoryCode: country.isoCode,
                    zoneCode: '',
                  })
                }
                placeHolder="Select Country"
                inputClassName="border p-2 rounded w-full"
              />

              <StateSelect
                countryid={editForm.territoryCode}
                value={editForm.zoneCode}
                onChange={(state) =>
                  setEditForm({
                    ...editForm,
                    zoneCode: state.isoCode,
                  })
                }
                placeHolder="Select State / Province"
                inputClassName="border p-2 rounded w-full"
              />

              <input
                name="zip"
                value={editForm.zip}
                onChange={(e) =>
                  setEditForm({ ...editForm, zip: e.target.value })
                }
                className="border p-2 rounded"
              />

             <div className="md:col-span-2">
  <PhoneInput
    country={editForm.territoryCode?.toLowerCase() || 'ng'}
    value={editForm.phoneNumber?.replace('+', '') || ''}
    onChange={(phone) =>
      setEditForm({
        ...editForm,
        phoneNumber: `+${phone}`,
      })
    }
    inputClass="!w-full !h-10 !rounded !border !border-gray-300"
    enableSearch
  />
</div>
            
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div key={address.id} className="border p-4 rounded">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {address.firstName} {address.lastName}
                </p>

                {customer.defaultAddress?.id === address.id && (
                  <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>
                {address.city}, {address.province} {address.zip}
              </p>
              <p>{address.country}</p>
              {address.phoneNumber && <p>{address.phoneNumber}</p>}

              <div className="mt-3 flex gap-4">
                <button
                  onClick={() => handleEditClick(address)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                {customer.defaultAddress?.id !== address.id && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Set as Default
                  </button>
                )}

                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Add Address Form */}
      <h3 className="text-xl font-semibold mb-4">Add New Address</h3>

      <form
        onSubmit={handleAddAddress}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          name="address1"
          placeholder="Address Line 1"
          onChange={handleChange}
          className="border p-3 rounded md:col-span-2"
          required
        />

        <input
          name="address2"
          placeholder="Address Line 2 (optional)"
          onChange={handleChange}
          className="border p-3 rounded md:col-span-2"
        />

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <CountrySelect
          value={form.territoryCode}
          
          onChange={(country) =>
  setForm({
    ...form,
    territoryCode: country.iso2, // use iso2, not isoCode
    zoneCode: '',
  })
}
          placeHolder="Select Country"
          inputClassName="border p-3 rounded w-full"
        />

        <StateSelect
          countryid={form.territoryCode}
          value={form.zoneCode}
          onChange={(state) =>
            setForm({
              ...form,
              zoneCode: state.isoCode,
            })
          }
          placeHolder="Select State / Province"
          inputClassName="border p-3 rounded w-full"
        />

        <input
          name="zip"
          placeholder="ZIP / Postal Code"
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

       <div className="md:col-span-2">
  <PhoneInput
    country={form.territoryCode?.toLowerCase() || 'ng'}
    value={form.phoneNumber}
    onChange={(phone) =>
      setForm({
        ...form,
        phoneNumber: `+${phone}`,
      })
    }
    inputClass="!w-full !h-12 !rounded !border !border-gray-300"
    enableSearch
  />
</div>

        <button
          type="submit"
          className="bg-black text-white py-3 rounded md:col-span-2"
        >
          Add Address
        </button>
      </form>
    </div>
  );
}