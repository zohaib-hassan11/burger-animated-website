import './globals.css';
import BrandBar from '@/components/BrandBar';

export const metadata = {
  title: 'Burger & Co. — Real burgers, made fresh.',
  description: 'Flame-grilled, hand-pressed, grass-fed. Open until late.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#150a07',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BrandBar />
        {children}
      </body>
    </html>
  );
}
