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
import { ChangePasswordScreen } from "./screens/ChangePasswordScreen";

import { RegistrationScreen } from "./screens/RegistrationScreen";
import { CartScreen } from "./screens/CartScreen";

import { MainLayout } from "./components/MainLayout";

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
    Component: MainLayout,
    children: [
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
      {
        path: "/edit-profile",
        Component: EditProfileScreen,
      },
      {
        path: "/change-password",
        Component: ChangePasswordScreen,
      },
    ]
  }
]);
