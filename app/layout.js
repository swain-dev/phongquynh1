import './globals.css';

export const metadata = {
  title: 'Thiệp Cưới | Trúc Quỳnh & Văn Phong',
  description: 'Trân trọng kính mời quý khách đến dự bữa tiệc chung vui cùng gia đình chúng tôi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="phone-container">
          {children}
        </div>
      </body>
    </html>
  );
}
