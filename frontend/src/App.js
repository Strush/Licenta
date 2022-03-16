import { Helmet } from 'react-helmet-async';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import SingleProduct from './components/SingleProduct';
import FrontPage from './screens/FrontPage';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <Helmet>
          <title>Eoomi</title>
        </Helmet>  
        <header className="header">
          <div className="container">
            <div className="header__nav">
              <div className='header__logo'>
                <Link to='/'>Eoomi</Link>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="container">
            <Routes>
              <Route path='/' element={<FrontPage />} />
              <Route path='/product/:slug' element={<SingleProduct/>} />
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
              <p>Eoomi &copy;, Toate drepturile au fost rezervate.</p>
            </div>
            </div>
          </div>
        </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
