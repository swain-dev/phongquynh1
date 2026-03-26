import './globals.css';

export const metadata = {
  title: 'Wedding Invitation',
  description: 'A beautiful wedding invitation built with Next.js',
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
