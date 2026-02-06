import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { OrdersProvider } from "./state/OrderContext";
import { UIProvider } from "./state/UIContext";

import { CartProvider } from "./state/CartContext";

function App() {
  return (
    <OrdersProvider>
      <CartProvider>
        <UIProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" richColors />
        </UIProvider>
      </CartProvider>
    </OrdersProvider>
  );
}

export default App;
