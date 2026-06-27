import { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

export default function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1) => {
        setCartItems(prevItems => {
            const productId = product._id || product.id;
            const existing = prevItems.find(item => (item._id === productId || item.id === productId));
            if (existing) {
                return prevItems.map(item =>
                    (item._id === productId || item.id === productId)
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: qty }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== id && item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                (item._id === id || item.id === id) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartSubtotal
        }}>
            {children}
        </CartContext.Provider>
    );
}
