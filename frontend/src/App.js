import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './components/Cart';
import SingIn from './components/SingIn';
import SingleProduct from './components/SingleProduct';
import FrontPage from './screens/FrontPage';
import { Store } from './Store';
import {Dropdown} from 'react-bootstrap';

function App() {

  const {state, dispatch: ctxDispatch} = useContext(Store);
  const { cart, userInfo } = state;

  const signOutHandler = () => {
    ctxDispatch({type:'USER_SIGN_OUT'});
    localStorage.removeItem('userInfo');
  }

  return (
    <BrowserRouter>
    <div className="App">
      <ToastContainer position="bottom-center" limit={1} />
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
                  {userInfo ? (
                    <>
                      <Dropdown>
                      <Dropdown.Toggle variant="none" id="dropdown-basic">
                        {userInfo.name}
                      </Dropdown.Toggle>
                    
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">User History</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">User Profile</Dropdown.Item>
                        <Dropdown.Item onClick={signOutHandler} >Sign Out</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    </>
                  ) : (<div className='nav__signin'>
                    <Link to='/signin'>Autentificare</Link>
                  </div>)
                  }
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
