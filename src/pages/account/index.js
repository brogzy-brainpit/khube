// pages/account/index.js
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
  return (
    <div>
      <h1>Welcome, {customer.firstName}!</h1>
      <p>Email: {customer.emailAddress.emailAddress}</p>

      <h2>Recent Orders</h2>
      <ul>
        {customer.orders.nodes.map((order) => (
          <li key={order.id}>
            {order.name} — {order.totalPrice.amount}{' '}
            {order.totalPrice.currencyCode}
          </li>
        ))}
      </ul>
    </div>
  );
}