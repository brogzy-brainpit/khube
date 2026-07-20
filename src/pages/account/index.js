import { getCustomer } from "@/utils/customer";

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [key, ...v] = c.split('=');
      return [key, v.join('=')];
    })
  );
}

export default function Account({ customer }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Account</h1>

      {customer ? (
        <>
          <p>
            <strong>Name:</strong> {customer.firstName}{' '}
            {customer.lastName}
          </p>

          <p>
            <strong>Email:</strong>{' '}
            {customer.emailAddress.emailAddress}
          </p>
        </>
      ) : (
        <p>Could not load customer data.</p>
      )}

      <hr />

      <a href="/account/orders">My Orders</a>
      <br />
      <a href="/account/addresses">My Addresses</a>
      <br />
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}

export async function getServerSideProps({ req }) {
 const cookies = parseCookies(req.headers.cookie || '');
const token = cookies.customer_access_token;
const apiUrl = cookies.customer_api_url;

if (!token || !apiUrl) {
  return {
    redirect: {
      destination: '/account/login',
      permanent: false,
    },
  };
}

try {
  const { data, errors } = await getCustomer(token, apiUrl);

  console.log('Customer API response:', { data, errors });

  return {
    props: {
      customer: data?.customer || null,
    },
  };
} catch (error) {
  console.error('Customer fetch error:', error);

  return {
    props: {
      customer: null,
    },
  };
}
}