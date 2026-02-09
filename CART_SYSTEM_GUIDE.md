# Cart System Implementation Guide

## Overview

This guide explains how to use the enhanced Cart system with localStorage persistence, dynamic badge updates, and animating indicators.

---

## 1. CartContext - Core State Management

Located in: `src/state/CartContext.tsx`

### Features:

- ✅ Persistent cart with localStorage
- ✅ Total items count (sum of all quantities)
- ✅ Total price calculation
- ✅ Automatic save/load on mount and change
- ✅ Error handling for storage failures

### API:

```typescript
interface CartContextValue {
  items: CartItem[]; // Array of cart items
  addItem(bottle, quantity): void; // Add item to cart
  updateQuantity(id, qty): void; // Update item quantity
  removeItem(bottleId): void; // Remove item from cart
  clearCart(): void; // Clear entire cart
  totalItems: number; // Total quantity (sum)
  totalPrice: number; // Total price (sum)
}
```

### Usage in Components:

```tsx
import { useCart } from "../state/CartContext";

function MyComponent() {
  const { items, totalItems, totalPrice, addItem, removeItem } = useCart();

  const handleAdd = () => {
    addItem(product, 2); // Add with quantity 2
  };

  return (
    <div>
      <p>Cart: {totalItems} items</p>
      <p>Total: ₹{totalPrice}</p>
    </div>
  );
}
```

---

## 2. CartHeader Component

Located in: `src/components/CartHeader.tsx`

### Features:

- Reusable header with cart icon
- Dynamic item count badge with animation
- Optional cart summary bar
- Responsive design
- Accessible

### Usage:

```tsx
import { CartHeader } from "../components/CartHeader";
import logo from "../components/logo.png";

function MyScreen() {
  return (
    <>
      <CartHeader
        title="Beer Menu"
        subtitle="Welcome back"
        logo={logo}
        showMenu={true}
        onMenuClick={() => console.log("Menu clicked")}
      />
      {/* Rest of your content */}
    </>
  );
}
```

### Props:

```typescript
interface CartHeaderProps {
  title?: string; // Header title (default: "MT Beer Order")
  subtitle?: string; // Subtitle text (default: "Quick & Easy")
  logo?: string; // Logo image path
  showMenu?: boolean; // Show menu toggle button
  onMenuClick?: () => void; // Menu click handler
}
```

---

## 3. BottomNav with Cart Badge

Located in: `src/components/BottomNav.tsx`

### Features:

- Cart icon in bottom navigation
- Animated badge (scale + spring animation)
- Shows "99+" for counts > 99
- Hides badge when cart is empty
- 1-click navigation to cart

### Behavior:

- Badge appears/disappears with smooth animation
- Spring physics for natural feel
- Border styling matches your design system

---

## 4. Complete Example: Add to Cart Flow

### Before (Without Context):

```tsx
// ❌ Old way - prop drilling
function Product({ onAddToCart }) {
  return <button onClick={() => onAddToCart()}>Add to Cart</button>;
}
```

### After (With Context):

```tsx
import { useCart } from "../state/CartContext";

function BottleItem({ bottle }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem(bottle, quantity);
    toast.success(`${quantity}x ${bottle.name} added to cart`);
    setQuantity(1); // Reset
  };

  return (
    <div>
      <h3>{bottle.name}</h3>
      <p>₹{bottle.price}</p>

      <div className="flex gap-2">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      <button onClick={handleAddToCart} className="btn-primary">
        Add to Cart
      </button>
    </div>
  );
}
```

---

## 5. Cart Screen - Remove & Update Items

```tsx
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router";

function CartScreen() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <p>Your cart is empty</p>
        <button onClick={() => navigate("/home")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item.bottle.id} className="cart-item">
          <h3>{item.bottle.name}</h3>
          <p>₹{item.bottle.price}</p>

          <div className="quantity-control">
            <button
              onClick={() => updateQuantity(item.bottle.id, item.quantity - 1)}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.bottle.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.bottle.id)}
            className="btn-danger"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="cart-total">
        <h2>Total: ₹{totalPrice.toFixed(2)}</h2>
        <button onClick={() => navigate("/order")} className="btn-primary">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
```

---

## 6. localStorage Persistence

### How It Works:

1. **On App Mount**: Loads cart from `localStorage` (key: `mt_beer_cart`)
2. **On Cart Change**: Automatically saves to `localStorage`
3. **On Refresh**: Cart persists and reloads

### Storage Format:

```json
{
  "mt_beer_cart": [
    {
      "bottle": { "id": 1, "name": "Kingfisher", "price": 80, ... },
      "quantity": 2
    }
  ]
}
```

### Clear Cart Manually:

```typescript
const { clearCart } = useCart();

// Also clears localStorage
clearCart();
```

---

## 7. Animation Details

### Badge Animation:

- **Scale**: 0 → 1 (on appear)
- **Rotation**: -180° → 0° (spin effect)
- **Exit**: Reverse animation
- **Easing**: Spring physics (stiffness: 300, damping: 20)

### Summary Bar Animation:

- **Opacity**: 0 → 1
- **Slide**: -10px → 0px (Y-axis)

---

## 8. Best Practices

### ✅ DO:

```tsx
// Use the hook to get fresh values
const { totalItems } = useCart();

// Add proper error handling
try {
  addItem(bottle, qty);
} catch (error) {
  toast.error("Failed to add to cart");
}

// Update quantity for removing
updateQuantity(id, Math.max(1, qty - 1));
```

### ❌ DON'T:

```tsx
// Don't recreate the context
const context = useContext(CartContext); // ❌

// Don't modify items directly
items[0].quantity = 5; // ❌

// Don't forget error boundaries
// Always wrap with CartProvider in App.tsx
```

---

## 9. Accessibility Features

- ✅ Semantic HTML buttons
- ✅ Title attributes on hover
- ✅ Clear visual feedback
- ✅ Keyboard navigation support
- ✅ ARIA labels ready to add

---

## 10. Performance Optimizations

- ✅ `useMemo` for totalItems and totalPrice
- ✅ Lazy localStorage loading
- ✅ Debounced storage saves
- ✅ Proper error boundaries

---

## Troubleshooting

### Cart not persisting after refresh?

```tsx
// Check console for errors
console.log(localStorage.getItem("mt_beer_cart"));

// Re-login if needed
// Clear browser cache if corrupted
localStorage.removeItem("mt_beer_cart");
```

### Badge not updating?

```tsx
// Make sure component is wrapped with CartProvider
// Check if useCart() throws error
// Verify quantity being passed to addItem()
```

### localStorage quota exceeded?

```tsx
// Clear old unused items
localStorage.clear(); // Last resort
```

---

## Summary

| Feature          | Status | Location                        |
| ---------------- | ------ | ------------------------------- |
| Context API      | ✅     | `src/state/CartContext.tsx`     |
| localStorage     | ✅     | Built into CartContext          |
| Badge Animation  | ✅     | `src/components/BottomNav.tsx`  |
| Header Component | ✅     | `src/components/CartHeader.tsx` |
| Total Count      | ✅     | `useCart().totalItems`          |
| Total Price      | ✅     | `useCart().totalPrice`          |
| Persistence      | ✅     | Auto-sync on change             |

---

**Now you have a production-ready cart system! 🎉**
