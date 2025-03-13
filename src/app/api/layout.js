import '../styles/globals.css';

export const metadata = {
  title: 'Round-Robin Coupon Distribution',
  description: 'Claim your coupon with our fair distribution system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}