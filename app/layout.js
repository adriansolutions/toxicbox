import "./globals.css";

export const metadata = {
  title: "Toxic Box",
  description: "Public Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
