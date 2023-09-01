import React from 'react'
import ReactDOM from 'react-dom/client'
import {  RouterProvider } from "react-router-dom";
import {router} from "./Routes/index"
import './index.css'
import { app } from "./firebaseConfig"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
