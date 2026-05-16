/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // FETCH CART
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
      });
      const data = await res.json();
      setCart(data.items || []);
    } catch (error) {
      console.log(error);
    }
  };

  // LOAD CART
  useEffect(() => {
    fetchCart();
  }, []);

  const isInCart = (productId) => {
    return cart.some((item) => {
      const itemProductId = item.product?._id || item.product;
      return itemProductId?.toString() === productId?.toString();
    });
  };

  // ADD TO CART
  const addToCart = async (product) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // REMOVE
  const removeFromCart = async (productId) => {
    try {
      await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // INCREASE
  const increaseQuantity = async (productId) => {
    try {
      await fetch("/api/cart/increase", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
        }),
      });

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  // DECREASE
  const decreaseQuantity = async (productId) => {
    try {
      const res = await fetch("/api/cart/decrease", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      if (res.status === 204) {
        fetchCart();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        console.error("Error decreasing quantity:", data.message);
        return;
      }

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const clearCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        credentials: "include",
      });
      setCart([]);
    } catch (error) {
      console.log("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        isInCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
