import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemToAdd, quantity = 1) => {
    setCartItems(prevItems => {
      // Create a unique ID for the cart item based on product and options
      const cartItemId = `${itemToAdd.id}-${itemToAdd.color || 'default'}-${itemToAdd.size || 'default'}`;
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
      const quantityToAdd = itemToAdd.quantity || quantity;

      if (existingItem) {
        // If item with same options exists, update its quantity
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: (item.quantity || 0) + quantityToAdd } // Ensure existing quantity is a number before adding
            : item
        );
      } else {
        // Otherwise, add new item to cart
        const newItem = { 
          ...itemToAdd, 
          quantity: quantityToAdd, 
          cartItemId,
          price: itemToAdd.discounted_price || itemToAdd.price // Explicitly set the price for the cart
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(0, parseInt(newQuantity) || 0) } // Ensure newQuantity is a valid number
          : item
      ).filter(item => item.quantity > 0) // Remove if quantity becomes 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};