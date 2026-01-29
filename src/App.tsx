import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { OrdersProvider } from "./state/OrderContext";

import { CartProvider } from "./state/CartContext";

function App() {
  return (
    <OrdersProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </CartProvider>
    </OrdersProvider>
  );
}

export default App;
