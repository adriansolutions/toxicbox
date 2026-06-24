import "./globals.css";

export const metadata = {
  title: "BlueChat",
  description: "Live Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
