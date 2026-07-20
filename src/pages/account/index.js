export default function Account() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Account</h1>
      <p>You are successfully logged in with Shopify Customer Accounts.</p>

      <a href="/account/orders">My Orders</a>
      <br />
      <a href="/account/addresses">My Addresses</a>
      <br />
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}