import './globals.css';
import BrandBar from '@/components/BrandBar';

export const metadata = {
  title: 'Burger & Co. — Real burgers, made fresh.',
  description: 'Flame-grilled, hand-pressed, grass-fed. Open until late.',
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
