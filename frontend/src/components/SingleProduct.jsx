import axios from 'axios';
import React, { useEffect, useReducer } from 'react'
import { Link, useParams } from 'react-router-dom';
import Rating from './Rating';

const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST' :
      return {...state, loading: true};
    case 'FETCH_SUCCESS' :
      return {...state, loading: false, product: action.payload};
    case 'FETCH_FAIL' :
      return {...state, loading: false, error: action.payload};
    default: 
      return state;
  }
  
}

function SingleProduct() {

  const params = useParams();
  const {slug} = params;

  const [{loading,product,error},dispatch] = useReducer(reducer,{
    loading: true,
    product: [],
    error: '',
  });

  useEffect(() => {
      const fetchData = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try {
          const result = await axios.get(`/api/products/slug/${slug}`);
          dispatch({type: 'FETCH_SUCCESS', payload: result.data });
        } catch(err) {
          dispatch({type: 'FETCH_FAIL', payload: err.message});
        }
      }
      fetchData();
  }, [slug]);

  return (
    <>
      { loading ? (<div>Loading...</div>) : error ? (<div>{error}</div>) : (
        <div className="single__product">
          <div className='product__thumbnail'>
              <div className='product__img'></div>
          </div>
          <div className="product__content">
            <div>
              <h2 className='title'>{product.name}</h2>
              <span className='price'>Price: <strong>{product.price}$</strong></span>
                  <Rating rating={product.rating} numReviews={product.numReviews} />
              <p className='description'>{product.description}</p>
            </div>
            {
              product.countInStock  ? 
              (
              <div className='product__cart'>
                <div className='mb-sm'>Price: {product.price}$</div>
                <p className='mb-sm'>Status: In stock <strong>{product.countInStock}</strong></p>
                <button className='btn btn-teal'>Add to Cart</button>
              </div>
              ) : (
                <div>
                  Unvaible
                </div>
              )
            }

          </div>
        </div>
        )
      }
    </>
  )
}
export default SingleProduct;
