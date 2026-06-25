import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import FloatingChatButton from "@/components/ui/FloatingChatButton";
import { CartProvider } from "@/context/CartContext"
export const metadata = {
  title: "Elkhalil Tech",
  description:
    "Discover premium electronics, smartphones, accessories, and the latest tech products with fast delivery and secure shopping experience."
  , icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <FloatingChatButton />
            <main>{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
