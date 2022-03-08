import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

function SingleProduct() {
  
  //Am creat stare []
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await axios.get('/api/products');
      setProducts(results.data);
    }
    fetchData();
  },[]);

    return (
      <>
        {
          
            products.map((product) => (
            <div className="product" key={product.slug}>
                <Link to={`product/${product.slug}`} className="product__thumbnail">
                <img src={product.image} alt="No Image"/>
                </Link>
                <div className="product__content">
                <Link to={`/product/${product.slug}`} className="product__name">
                    <p>{product.name}</p>
                </Link>
                <p className="product__price"><strong>${product.price}</strong></p>
                <button className="product__button">Add to cart</button>
                </div>
            </div>
            ))
        }
      </>
    )
}
export default SingleProduct;
