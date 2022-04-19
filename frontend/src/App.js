import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import Cart from './components/Cart';
import SingIn from './components/SingIn';
import SingleProduct from './components/SingleProduct';
import FrontPage from './screens/FrontPage';
import { Store } from './Store';

function App() {

  const {state} = useContext(Store);
  const { cart } = state;

  return (
    <BrowserRouter>
    <div className="App">
        <Helmet>
          <title>Eoomi</title>
        </Helmet>  
        <header className="header">
          <div className="container">
            <div className="nav">
              <div className='logo'>
                <Link to='/'>Eoomi</Link>
              </div>
              <div className='menu'>
                  <Link className='cart' to={'/cart'}>Coș
                  {cart.cartItems.length > 0 && (
                    <div className='badge'>{cart.cartItems.reduce((a,c) => a + c.quantity,0)}</div>
                  )}
                  </Link>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="container">
            <Routes>
              <Route path='/' element={<FrontPage />} />
              <Route path='/product/:slug' element={<SingleProduct/>} />
              <Route path='/cart' element={<Cart/>} />
              <Route path='/signin' element={<SingIn/>} />
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
