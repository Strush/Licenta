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
import { Container } from 'react-bootstrap';
import Footer from './components/Footer';

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
              <Route path='/' element={<FrontPage />} />
              <Route path='/product/:slug' element={<SingleProduct/>} />
              <Route path='/cart' element={<Cart/>} />
              <Route path='/signin' element={<SingIn/>} />
              <Route path='/signup' element={<SignUp/>} />
              <Route path='/shipping' element={<Shipping />} />
              <Route path='/payment' element={<PaymentMethod />} />
              <Route path='/placeholder' element={<Orderscreen />} />
              <Route path='/orderhistory' element={<OrderHistory />} />
              <Route path='/users/profile' element={<UserProfile />} />
              <Route path='/order/:id' element={<OrderDetails />} />
            </Routes>
          </div>
        </main>
        <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App;
