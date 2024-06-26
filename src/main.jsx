import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RateCalender from './Pages/RateCalender.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RateCalender></RateCalender>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);