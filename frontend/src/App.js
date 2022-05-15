import { Helmet } from 'react-helmet-async';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './components/Cart';
import SingIn from './components/SingIn';
import SingleProduct from './components/SingleProduct';
import FrontPage from './screens/FrontPage';
import Shipping from './components/Shipping';
import SignUp from './components/SignUp';
import PaymentMethod from './components/PaymentMethod';
import Orderscreen from './components/OrderScreen';
import OrderDetails from './components/OrderDetails';
import OrderHistory from './components/OrderHistory';
import Header from './components/Header';
import UserProfile from './screens/UserProfile';

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
        <footer className='footer'>
          <div className='container'>
            <div className='content'>
            <div className='footer__log'>
              <Link to='/'>Eoomi</Link>
            </div>
            <div className='footer__nav'>
              <p className='copyright'>Eoomi &copy;, Toate drepturile au fost rezervate.</p>
            </div>
            </div>
          </div>
        </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
