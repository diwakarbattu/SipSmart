import { createBrowserRouter } from "react-router";
import { SplashScreen } from "./screens/SplashScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { BottleListScreen } from "./screens/BottleListScreen";
import { OrderFormScreenNew as OrderFormScreen } from "./screens/OrderFormScreenNew";
import { AddressScreen } from "./screens/AddressScreen";
import { SuccessScreen } from "./screens/SuccessScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { OrdersScreen } from "./screens/OrdersScreen";
import { EditProfileScreen } from "./screens/EditProfileScreen";

import { RegistrationScreen } from "./screens/RegistrationScreen";
import { CartScreen } from "./screens/CartScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/login",
    Component: LoginScreen,
  },
  {
    path: "/register",
    Component: RegistrationScreen,
  },
  {
    path: "/home",
    Component: BottleListScreen,
  },
  {
    path: "/cart",
    Component: CartScreen,
  },
  {
    path: "/order",
    Component: OrderFormScreen,
  },
  {
    path: "/address",
    Component: AddressScreen,
  },
  {
    path: "/success",
    Component: SuccessScreen,
  },
  {
    path: "/orders",
    Component: OrdersScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
  {
    path: "/profile/edit",
    Component: EditProfileScreen,
  },
]);
