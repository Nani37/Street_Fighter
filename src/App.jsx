import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter,RouterProvider} from "react-router";
import FightingGame from "./Fighter";
import Homepage from "./Homepage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/fighter",
    element: <FightingGame />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <BrowserRouter>
//   <Routes>
//     <Route path="/" element={<Homepage />} />
//     <Route path="/fighter" element={<FightingGame />} />
//   </Routes>
//   </BrowserRouter>
//  
root.render(<RouterProvider router={router} />);