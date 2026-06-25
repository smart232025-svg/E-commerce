"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // ===== التحقق من المصادقة من localStorage أو cookie =====
  const checkAuthStatus = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // ===== تحميل السلة =====
  const loadCart = async () => {
    setIsLoading(true);
    try {
      // ✅ نتحقق من المصادقة أولاً
      await checkAuthStatus();

      if (isAuthenticated && user) {
        // ✅ مستخدم مسجل (أدمن) - جلب من MongoDB
        const res = await fetch("/api/cart", {
          credentials: "include",
        });
        const data = await res.json();
        setCart(data.items || []);
        localStorage.setItem("guestCart", JSON.stringify(data.items || []));
      } else {
        // ✅ ضيف - جلب من localStorage
        const savedCart = localStorage.getItem("guestCart");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          setCart([]);
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      const savedCart = localStorage.getItem("guestCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ===== حفظ السلة =====
  const saveCart = async (newCart) => {
    setCart(newCart);
    localStorage.setItem("guestCart", JSON.stringify(newCart));

    if (isAuthenticated && user) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            items: newCart.map((item) => ({
              product: item.product._id || item.product,
              quantity: item.quantity,
            })),
          }),
        });
      } catch (error) {
        console.error("Error saving cart to DB:", error);
      }
    }
  };

  // ===== تحميل السلة عند بدء التشغيل =====
  useEffect(() => {
    loadCart();
  }, []);

  // ===== دالة التحقق من وجود المنتج =====
  const isInCart = (productId) => {
    return cart.some((item) => {
      const itemProductId = item.product?._id || item.product;
      return itemProductId?.toString() === productId?.toString();
    });
  };

  // ===== إضافة للسلة =====
  const addToCart = async (product) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex((item) => {
      const itemProductId = item.product?._id || item.product;
      return itemProductId?.toString() === product._id?.toString();
    });

    if (existingIndex !== -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ product, quantity: 1 });
    }

    await saveCart(newCart);
  };

  // ===== حذف من السلة =====
  const removeFromCart = async (productId) => {
    const newCart = cart.filter((item) => {
      const itemProductId = item.product?._id || item.product;
      return itemProductId?.toString() !== productId?.toString();
    });
    await saveCart(newCart);
  };

  // ===== زيادة الكمية =====
  const increaseQuantity = async (productId) => {
    const newCart = cart.map((item) => {
      const itemProductId = item.product?._id || item.product;
      if (itemProductId?.toString() === productId?.toString()) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    await saveCart(newCart);
  };

  // ===== إنقاص الكمية =====
  const decreaseQuantity = async (productId) => {
    const newCart = cart
      .map((item) => {
        const itemProductId = item.product?._id || item.product;
        if (itemProductId?.toString() === productId?.toString()) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    await saveCart(newCart);
  };

  // ===== مسح السلة بالكامل =====
  const clearCart = async () => {
    await saveCart([]);
  };

  // ===== دمج سلة الضيف مع سلة المستخدم =====
  const mergeCarts = (guestCart, userCart) => {
    const merged = [...userCart];
    guestCart.forEach((guestItem) => {
      const existing = merged.find(
        (item) => item.product._id === guestItem.product._id,
      );
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        merged.push(guestItem);
      }
    });
    return merged;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        isInCart,
        clearCart,
        mergeCarts,
        saveCart,
        loadCart,
        cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
