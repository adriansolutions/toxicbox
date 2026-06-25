import "./globals.css";

export const metadata = {
  title: "BlueChat",
  description: "Live Chat App",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BlueChat",
  },

  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
