import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify'
// import NotFound from './Pages/ErrorPage.jsx'
import 'react-toastify/dist/ReactToastify.css';
import Signup from './components/registration/Signup.jsx'
import Signin from './components/registration/Signin.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path='/' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
      </Route>
      {/* <Route path="*" element={<NotFound />} /> */}
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <RouterProvider router={router} />
  </StrictMode>,
)
