import axios from 'axios';
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import getError from '../utils';
import LoadingBox from '../components/LoadingBox';
import Messagebox from '../components/MessageBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPenToSquare} from '@fortawesome/free-regular-svg-icons';
import Rating from '../components/Rating';
import {Store} from '../Store';
import { Badge, Button, Card, FloatingLabel, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch(action.type) {
    case 'CREATE_REFRESH' :
        return {...state, product: action.payload}
    case 'CREATE_REQUEST' :
      return {...state, loadingCreate: true};
    case 'CREATE_SUCCESS' :
      return {...state, loadingCreate: false};
    case 'CREATE_FAIL' :
      return {...state, loadingCreate: false};

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

  const reviewsRef = useRef();
  const params = useParams();
  const {slug} = params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImages, setSelectedImages] = useState('');

  const [{loading,product,error,loadingCreate},dispatch] = useReducer(reducer,{
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
  const {cart,userInfo} = state;

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

  const createRewiewHandler = async (e) => {
    e.preventDefault();
    if(!rating || !comment){
      toast.error('Te rog lasa o recenzie si un rating');
      return;
    }
    try {
      dispatch({type: 'CREATE_REQUEST'});
      const {data} = await axios.post(`/api/products/${product._id}/reviews`, 
      {
        rating, comment, name: userInfo.name
      }, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      dispatch({type: 'CREATE_SUCCESS'});
      toast.success('Recenzi a fost publicata cu success');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({type: 'CREATE_REFRESH', payload: product});

      window.scroll({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch(err){
      toast.error(getError(err));
      dispatch({type: 'CREATE_FAIL'});
    }
  }

  return (
    <>
      <Helmet>
        <title>{product.name}</title>
      </Helmet> 
      { loading ? (<LoadingBox />) : error ? (<Messagebox variant="danger">{error}</Messagebox>) : (
        <div className="single__product">
          <div className='product__thumbnail cl-1'>
              <img className='product__img' 
                src={selectedImages || product.image} 
                alt="No Image" 
              />
          </div>
          <div className='px-lg-0 cl-2'>
            <div className='product__content'>
              <div className='w-100'>          
                <h2 className='title mb-3 d-flex'>
                  {product.name} &nbsp; 
                  {userInfo && userInfo.isAdmin ? 
                    (<Link to={`/admin/product/${product._id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} className='me-2' /></Link>) 
                    : ''
                  }
                </h2>
                <h4 className='price mb-3'>Pretul: <strong>{product.price} lei</strong></h4>
                  <div className='rating-box mb-3'>
                    <Rating rating={product.rating} numReviews={product.numReviews} />
                  </div>

                  <div className='reviews-block g-2'>
                    {
                      [product.image, ...product.images].map((img) => (
                        <div className='reviews--item' key={img}>
                          <Card className='view-uploads__card'>
                            <Card.Img
                              variant='full'
                              src={img}
                              className="view-uploads__image"
                              onClick={() => setSelectedImages(img)}
                              alt="product"
                            />
                          </Card>
                        </div>
                      ))
                    }
                  </div>
              </div>
              <div className='product__cart'>
                <h5 className='mb-3 item-flex'>Prețul: <strong>{product.price} lei</strong></h5>
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
          <div className='mb-3 cl-3'>
            <h3 ref={reviewsRef} className="mb-3">Recenzii</h3>
            <div className='mb-3'>
              {product.reviews.length === 0 && (<Messagebox>Nu există nici o recenzie</Messagebox>)}
            </div>

            <ListGroup>
              {product.reviews.map((review) => (
                <ListGroupItem key={review._id} className="mb-3">
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption={" "} />
                  <p>Data: {review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroupItem>
              ))}

            </ListGroup>
            {userInfo ? (
              <div className='mb-3'>
                {product.reviews.find((user) => user.name === userInfo.name) ? 
                (<h4>Mulțumim pentru recenzia lăsată</h4>)
                : (
                  <>
                    <h3 className='mb-3'>Lăsați o recenzie</h3>
                    <form onSubmit={createRewiewHandler}>
                      <Form.Group controlId="rating" className='mb-3 mb-sm-4'>
                          <Form.Label>Rating</Form.Label>
                          <Form.Select
                            aria-label='Rating'
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="0">Select...</option>
                            <option value="1">1 - Negativ</option>
                            <option value="2">2 - Rău</option>
                            <option value="3">3 - Bun</option>
                            <option value="4">4 - Foarte bun</option>
                            <option value="5">5 - Excelent</option>

                          </Form.Select>
                      </Form.Group>
                      <Form.Group>
                        <FloatingLabel
                          controlId='floatingTextarea'
                          label="Lasa o recenzie"
                          className='mb-3'
                        >
                          <Form.Control
                            as="textarea"
                            rows={6}
                            placeholder='Lasati o recenzie'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          >
                          </Form.Control>
                        </FloatingLabel>
                      </Form.Group>
                      <div>
                        <Button variant='primary' type='submit' disabled={loadingCreate}>
                          Publica
                        </Button>
                        {loadingCreate && <LoadingBox/>}
                      </div>
                    </form>
                  </>
                )}
              </div>
              ) : (
                <div className='d-flex'><Link to={`/signin?redirect=${product._id}`} className="d-block me-1">Autentificate</Link> <p>pentru a lasa o recenzie.</p></div>
              )}
          </div>
        </div>
        )
      }
    </>
  )
}
export default SingleProduct;
