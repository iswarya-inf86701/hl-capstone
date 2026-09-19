import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

const CartContext = createContext(null)

export function CartProvider ({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart =
        sessionStorage.getItem('cart')

      return savedCart
        ? JSON.parse(savedCart)
        : []
    } catch (error) {
      console.log(
        'Unable to load cart:',
        error
      )

      return []
    }
  })

  // Save cart whenever it changes
  useEffect(() => {
    sessionStorage.setItem(
      'cart',
      JSON.stringify(cartItems)
    )
  }, [cartItems])

  // Add product to cart. Defaults to quantity 1
  // but supports adding a specified quantity at once.
  function addToCart (product, quantity = 1) {
    const quantityToAdd = Math.max(1, Number(quantity) || 1)

    setCartItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.productId ===
            product.productId
        )

      if (existingItem) {
        return currentItems.map(
          (item) =>
            item.productId ===
            product.productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantityToAdd
                }
              : item
        )
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: quantityToAdd
        }
      ]
    })
  }

  // Remove product completely
  function removeFromCart (productId) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.productId !== productId
      )
    )
  }

  // Increase quantity
  function increaseQuantity (productId) {
    setCartItems((currentItems) =>
      currentItems.map(
        (item) =>
          item.productId === productId
            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }
            : item
      )
    )
  }

  // Decrease quantity
  function decreaseQuantity (productId) {
    setCartItems((currentItems) =>
      currentItems
        .map(
          (item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity - 1
                }
              : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    )
  }

  // Clear entire cart
  function clearCart () {
    setCartItems([])
  }

  // Number of different products
  const cartItemCount =
    cartItems.length

  // Total number of items including quantities
  const cartQuantity =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )

  // Calculate total price
  const cartTotal =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          item.quantity,
      0
    )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartItemCount,
        cartQuantity,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart () {
  const context =
    useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}

export default CartContext