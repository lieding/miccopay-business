import "./styles.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

export default function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}
