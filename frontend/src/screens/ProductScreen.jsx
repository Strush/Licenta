import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import Messagebox from "../components/MessageBox";

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

function ProductScreen(){

    const [{loading,products,error},dispatch] = useReducer(reducer,{
        loading: true,
        products: [],
        error: '',
    });

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

    return (
        <div className="products">
            {
                loading ? (<LoadingBox />)
                : error ? (<Messagebox variant="danger">{error}</Messagebox>) 
                : ( 
                    products.map((product) => (
                        <div className="product" key={product.slug}>
                            <Link to={`product/${product.slug}`} className="thumbnail">
                                <div className='product__img'></div>
                            </Link>
                            <div className="content">
                                <Link to={`/product/${product.slug}`} className="name">
                                    <p>{product.name}</p>
                                 </Link>
                                <p className="price"><strong>${product.price}</strong></p>
                                {(product.countInStock > 0) ? (<Link to={`/product/${product.slug}`} className="btn btn-teal">Add to cart</Link>) : (
                                    <button className="btn btn-disable">Stock Epuizat</button>
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
