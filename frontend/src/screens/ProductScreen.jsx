import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import Messagebox from "../components/MessageBox";
import { Store } from "../Store";
import { Button } from "react-bootstrap";

// Am creat reducer
const reducer = (state,action) => {
    switch(action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS': 
            return {...state, loading: false, products: action.payload};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default :
            return state;
    }
} 

function ProductScreen(props){

    const [{loading,products,error},dispatch] = useReducer(reducer,{
        loading: true,
        products: [],
        error: '',
    });

    const {state, dispatch: ctxContext}  = useContext(Store);
    const {cart: {cartItems}} = state;

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST', loading: true});
            try {
                const results = await axios.get('/api/products');
                dispatch({type: 'FETCH_SUCCESS', payload: results.data, loading: false});
            } catch(err){
                dispatch({type: 'FETCH_FAIL', payload: err.message, loading: false});
            }
        }
        fetchData();
    }, []);

    const addToCart = async (item) => {
        const existProduct = cartItems.find((x) => x._id === item._id);
        const quantity = existProduct ? existProduct.quantity + 1 : 1;

        const {data} = await axios.get(`/api/products/${item._id}`);
        if(data.countInStock < quantity){
            window.alert('Produsul nu mai este in stock');
            return;
        }
        ctxContext({
            type: 'CART_ADD_ITEM',
            payload: {...item, quantity}
        })

    }

    return (
        <div className="products">
            {
                loading ? (<LoadingBox />)
                : error ? (<Messagebox variant="danger">{error}</Messagebox>) 
                : ( 
                    products.map((product) => (
                        <div className="product" key={product.slug}>
                            <Link to={`product/${product.slug}`} className="thumbnail">
                                <img className='product__img' src={product.image} alt={product.slug} />
                            </Link>
                            <div className="content">
                                <Link to={`/product/${product.slug}`} className="name">
                                    <p>{product.name}</p>
                                 </Link>
                                <p className="price"><strong>{product.price} lei</strong></p>
                                {(product.countInStock > 0) ? (<Button variant="primary" className="w-100" onClick={() => addToCart(product)}>Adaugă în Coș</Button>) : (
                                    <Button variant="light" className="w-100" disabled>Stock Epuizat</Button>
                                ) }
                            </div>
                        </div>
                    ))
                )
            }
        </div>
    )
}
export default ProductScreen;
