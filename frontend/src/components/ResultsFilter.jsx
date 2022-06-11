import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {Button, Col,Row} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import LoadingBox from './LoadingBox'; 
import getError from '../utils';
import Rating from './Rating';
import MessageBox from './MessageBox';
import {LinkContainer} from 'react-router-bootstrap';
import Product from './Product';

const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS': 
            return {
                ...state,
                products: action.payload.products, 
                page: action.payload.page,
                pages: action.payload.pages, 
                countProducts: action.payload.countProducts,
                loading: false
            }
        case 'FECTH_FAIL':
            return {...state, loading: false, error: action.payload}
        default: 
            return state;
    }
}

export default function ResultsFilter() {

    // Prices
    const prices = [
        {
            name: "0 to 50",
            value: "0-50"
        },
        {
            name: "51 to 200",
            value: "51-200"
        },
        {
            name: "201 to 1000",
            value: "201-1000"
        },
    ];

    // Rating
    const ratings = [
        {
            name: "4stars & up",
            rating: 4
        }, 
        {
            name: "3stars & up",
            rating: 3
        }, 
        {
            name: "2stars & up",
            rating: 2
        } ,
        {
            name: "1stars & up",
            rating: 1
        }
    ];

    const navigate = useNavigate();
    const {search} = useLocation();
    const eq = new URLSearchParams(search);

    const query = eq.get('query') || 'all';
    const category = eq.get('category') || 'all';
    const price = eq.get('price') || 'all';
    const rating = eq.get('rating') || 'all';
    const order = eq.get('order') || 'newest';
    const page = eq.get('page') || 1;

    const [{loading, error, pages, products, countProducts}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch(err){
                dispatch({type: 'FETCH_FAIL', payload: getError(err)})
            }
        }

        fetchData();
    }, [query, error, category, price, rating, order, page]);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const {data} = await axios.get('/api/products/categories');
                setCategories(data);
            } catch(err) {
                toast.error(getError(err));
            }
        }
        fetchCategories();
    }, [dispatch]);

    const getUrlFilter = (filter) => {
        const filterPage = filter.page || page; 
        const filterCategory = filter.category || category;
        const filterPrice = filter.price || price;
        const filterRating = filter.rating || rating;
        const sortOrder = filter.order || order;
        const filterQuery = filter.query || query;
        return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
    }

    return (
    <div>
        <Helmet>
            <title>Sorteaza produsele</title>
        </Helmet>
        <Row>
            <Col md={2}>
                {categories.length !==0 
                ? (
                    <div className='mb-3'>
                        <h4 className='text-bold'>Brand</h4>
                        <ul>
                            <li>
                                <Link 
                                    to={getUrlFilter({category: 'all'})} 
                                    className={category === 'all' ? 'text-bold' : ''}>
                                    Any
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <Link 
                                        to={getUrlFilter({category: cat})}
                                        className={category === cat ? 'text-bold' : ''}
                                    > {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : 'No brand found!'
                }
                <div className='mb-3'>
                    <h4 className='text-bold'>Pret</h4>
                    <ul>
                        <li>
                            <Link 
                                to={getUrlFilter({price: 'all'})}
                                className={price === 'all' ? 'text-bold' : ''}
                                > Any
                            </Link>
                        </li>
                        {prices.map((p) => (
                            <li key={p.name}>
                                <Link 
                                    to={getUrlFilter({price: p.value})}
                                    className={p.value === price ? 'text-bold' : ''}
                                > {p.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            {/* // Ratings */}
            <div className='mb-3'>
                <h4 className='text-bold'>Rating</h4>
                <ul>
                    <li>
                        <Link
                            to={getUrlFilter({rating: 'all'})}
                            className={rating === "all" ? "text-bold" : ''}
                        >   Any
                        </Link>
                    </li>
                    {ratings.map((r) => (
                        <li key={r.rating}>
                            <Link
                                to={getUrlFilter({rating: r.rating})}
                                className={r.rating === rating ? 'text-bold' : ""}
                            >
                             <Rating caption={' '} rating={r.rating} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            </Col>
            <Col md={10}>
                {loading ? 
                (<LoadingBox />) 
                :
                error ? (<MessageBox variant="danger">{error}</ MessageBox>) 
                : (
                    <>
                        <Col md={6}>
                            <div>
                                {countProducts === 0 ? 'No' : countProducts} Rezultate
                                {query !== 'all' && ' : ' + query}
                                {category !== 'all' && ' : ' + category}
                                {price !== 'all' && ' : ' + price}
                                {rating !== 'all' && ' : Rating ' + rating}
                                {query !== 'all' || category !== 'all' || price !== 'all' || rating !== 'all' ? (
                                    <Button variant='light' onClick={() => navigate('/search')}>
                                        <FontAwesomeIcon  icon={faTimes} />
                                    </Button> 
                                ) : null}  
                            </div>
                        </Col>
                        <Col className='text-end'>
                            Sorteaza dupa{' '}
                            <select 
                                value={order}
                                onChange={(e) => {
                                    navigate(getUrlFilter({order: e.target.value}));
                                }}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="lowest">Price: Low to High</option>
                                <option value="highest">Price: High to Low</option>
                                <option value="toprated">Rating</option>
                            </select>
                        </Col>

                        <Row>
                            {products.length === 0 ? (
                                <MessageBox variant="danger">Nu sa gasit nici un produs!</MessageBox>
                            ) : (
                                    products.map((product) => (
                                        <Col sm={6} lg={4} key={product._id} className="mb-3">
                                            <Product product={product} />
                                        </Col>
                                    ))
                                )
                            }
                        </Row>

                        <Row>
                            <Col>
                                {[...Array(pages).keys()].map((x) => (
                                    <LinkContainer
                                        key={x+1}
                                        className="mx-1"
                                        to={getUrlFilter({page: x + 1})}
                                    >
                                        <Button
                                            className={Number(page) === x + 1 ? 'text-bold' : ''}
                                            variant="light"
                                        >
                                            {x + 1}
                                        </Button>
                                    </LinkContainer>
                                ))}
                            </Col>
                        </Row>
                    </>
                )                
                }
            </Col>
        </Row>
    </div>
    )
}
