import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Register, Login, HomeLayout } from "./pages";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  

  return (
    
      <RouterProvider router={router} />
    
  );
}

export default App;
