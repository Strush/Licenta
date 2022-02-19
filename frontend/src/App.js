import data from './data';

function App() {
  return (
    <div className="App">
      <main>
        <header className="App-header">
          {/* Afisare produse */}
          <div className="products">
            {
              data.products.map((product) => (
                <div className="product" key={product.slug}>
                  <a href={`product/${product.slug}`} className="product__thumbnail">
                    <img src={product.image} alt="No Image"/>
                  </a>
                  <div className="product__content">
                    <a href={`/product/${product.slug}`} className="product__name">
                      <p>{product.name}</p>
                    </a>
                    <p className="product__price"><strong>${product.price}</strong></p>
                    <button className="product__button">Add to cart</button>
                  </div>
                </div>
              ))
            }
          </div>
        </header>
      </main>
    </div>
  );
}

export default App;
