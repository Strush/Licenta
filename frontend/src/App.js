import {BrowserRouter, Route, Routes} from 'react-router-dom';
import FrontPage from './screens/FrontPage';
import ProductScreen from './screens/ProductScreen';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <header className="App-header">
          header
        </header>
        <main>
          <Routes>
            <Route path='/' element={<FrontPage />} />
            <Route path='/product/:slug' element={<ProductScreen/>} />
          </Routes>
        </main>
    </div>
    </BrowserRouter>
  );
}

export default App;
