export const metadata = {
  title: "Toxic Box",
  description: "Toxic Box Chat"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
