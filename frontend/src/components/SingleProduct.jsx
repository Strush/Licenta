import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import getError from '../utils';
import LoadingBox from './LoadingBox';
import Messagebox from './MessageBox';
import Rating from './Rating';
import {Store} from '../Store';
import { Button } from 'react-bootstrap';

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
          dispatch({type: 'FETCH_FAIL', payload: getError(err) });
        }
      }
      fetchData();
  }, [slug]);

  // Adaugam produsul in cos
  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {cart} = state;

  const addToCartHandler = async () => {
    const existProduct = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existProduct ? existProduct.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`);
    if(data.countInStock < quantity){
      window.alert('Produsul nu se afla in stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: {...product, quantity}
    })
  }

  return (
    <>
      { loading ? (<LoadingBox />) : error ? (<Messagebox variant="danger">{error}</Messagebox>) : (
        <div className="single__product">
          <div className='product__thumbnail'>
              <img className='product__img' src={product.image} alt="No Image"></img>
          </div>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>    
          <div className="product__content">
            <div>          
              <h2 className='title'>{product.name}</h2>
              <span className='price'>Price: <strong>{product.price}$</strong></span>
                  <Rating rating={product.rating} numReviews={product.numReviews} />
              <p className='description'>{product.description}</p>
            </div>

            <div className='product__cart'>
              <div className='mb-sm'>Price: {product.price}$</div>
              <div className='status'>
                <p>Status:</p>
                <p className={product.countInStock ? 'bage bage-success' : 'bage bage-danger'}>{product.countInStock ? 'In stock' : 'Unavailable'}</p>
              </div>
              {product.countInStock ? <Button variant='flush' className='btn-teal mt-20' onClick={addToCartHandler}>Adaugă în Coș</Button> : ''}
            </div>

          </div>
        </div>
        )
      }
    </>
  )
}
export default SingleProduct;
