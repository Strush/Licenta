import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import getError from '../utils';
import LoadingBox from '../components/LoadingBox';
import Messagebox from '../components/MessageBox';
import Rating from '../components/Rating';
import {Store} from '../Store';
import { Badge, Button } from 'react-bootstrap';

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
      <Helmet>
        <title>{product.name}</title>
      </Helmet> 
      { loading ? (<LoadingBox />) : error ? (<Messagebox variant="danger">{error}</Messagebox>) : (
        <div className="single__product">
          <div className='product__thumbnail'>
              <img className='product__img' src={product.image} alt="No Image"></img>
          </div>   
          <div className='px-3 px-lg-0'>
            <div className='product__content'>
              <div>          
                <h2 className='title mb-3'>{product.name}</h2>
                <h4 className='price mb-3'>Pretul: <strong>{product.price} lei</strong></h4>
                  <div className='rating-box'>
                    <Rating rating={product.rating} numReviews={product.numReviews} />
                  </div>
              </div>
              <div className='product__cart'>
                <h5 className='mb-3 item-flex'>Pretul: <strong>{product.price}lei</strong></h5>
                <div className='status item-flex w-full'>
                  <h5>Status:</h5>
                  <h5>
                    <Badge bg={product.countInStock ? 'success' : 'danger'} className='p-2 p-lg-2'>{product.countInStock ? 'In stock' : 'Indisponibil'}</Badge>
                  </h5>
                </div>
                {product.countInStock ? <Button variant='primary' className='w-100 text-center mt-3' onClick={addToCartHandler}>Adaugă în Coș</Button> : ''}
              </div>
            </div>
            <p className='description mt-3'><strong>Descriere:</strong> {product.description}</p>
          </div>
        </div>
        )
      }
    </>
  )
}
export default SingleProduct;
