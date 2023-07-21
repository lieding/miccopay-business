import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import OrderDisplayPage from "./pages/orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/orderDisplay",
    element: <OrderDisplayPage />
  }
]);

export default router;
