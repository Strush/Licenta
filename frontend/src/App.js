import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import SingleProduct from './components/SingleProduct';
import FrontPage from './screens/FrontPage';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
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
        <footer>
          <p>Footer</p>
        </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
