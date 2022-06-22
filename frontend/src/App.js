import React from "react";
import { Helmet } from 'react-helmet-async';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './screens/Cart';
import SingIn from './screens/SingIn';
import SingleProduct from './screens/SingleProduct';
import FrontPage from './screens/FrontPage';
import Shipping from './screens/Shipping';
import SignUp from './screens/SignUp';
import PaymentMethod from './screens/PaymentMethod';
import Orderscreen from './screens/OrderScreen';
import OrderDetails from './screens/OrderDetails';
import OrderHistory from './screens/OrderHistory';
import Header from './components/Header';
import UserProfile from './screens/UserProfile';
import Footer from './components/Footer';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminRoute from './admin/AdminRoute';
import Dashboard from './screens/Admin/Dashboard';
import ResultsFilter from './components/ResultsFilter';
import Products from './screens/Admin/Products';
import ProductDetails from './screens/Admin/ProductDetails';
import Orders from './screens/Admin/Orders';
import ListUsers from './screens/Admin/ListUsers';
import UserEdit from './screens/Admin/UserEdit';

function App() {
  
  return (
    <BrowserRouter>
    <div className="App">
      <ToastContainer position="bottom-center" limit={1} />
        <Helmet>
          <title>Eoomi</title>
        </Helmet>  
        <Header />
        <main>
          <div className="container">
            <Routes>
              <Route path='/product/:slug' element={<SingleProduct/>} />
              <Route path='/cart' element={<Cart/>} />
              <Route path='/signin' element={<SingIn/>} />
              <Route path='/signup' element={<SignUp/>} />
              <Route path='/shipping' element={<ProtectedRoute> <Shipping /></ProtectedRoute>} />
              <Route path='/payment' element={<ProtectedRoute><PaymentMethod /></ProtectedRoute> } />
              <Route path='/search' element={<ResultsFilter />} />
              <Route path='/placeholder' element={<Orderscreen />} />
              <Route path='/orderhistory' element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path='/users/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path='/order/:id' element={<ProtectedRoute><OrderDetails /></ProtectedRoute> } />

              {/* Admin Routes */}
              <Route path='/admin/dashboard' element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path='/admin/products' element={<AdminRoute><Products /></AdminRoute>} />
              <Route path='/admin/orders' element={<AdminRoute><Orders /></AdminRoute>} />
              <Route path='/admin/users' element={<AdminRoute><ListUsers /></AdminRoute>} />
              <Route path='/admin/user/:id' element={<AdminRoute><UserEdit /></AdminRoute>} />
              <Route path='/admin/product/:id' element={<AdminRoute><ProductDetails /></AdminRoute>} />

              <Route path='/' element={<FrontPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App;
