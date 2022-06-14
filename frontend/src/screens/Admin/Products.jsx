import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { useLocation } from 'react-router-dom'
import LoadingBox from '../../components/LoadingBox';
import Messagebox from '../../components/MessageBox';
import { Store } from '../../Store'
import getError from '../../utils'
import { Helmet } from 'react-helmet-async'
import { Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

const reducer = (state, action) => {
    switch(action.type){
        case 'FECTH_REQUEST':
            return {...state, loading: true}
        case 'FECTH_SUCCES':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false
            }
        case 'FECTH_FAIL':
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        default: 
            return state;
    }
}

export default function Products() {

    const [{loading, error, pages, products}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    const {search, pathname} = useLocation();
    const sq = new URLSearchParams(search);
    const page  = sq.get('page') || 1;

    useEffect(() => {
        const fecthData = async () => {
            try {
                const {data} = await axios.get(`/api/products/admin/?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });
                dispatch({type: 'FECTH_SUCCES', payload: data})
            } catch(err) {
                dispatch({type: 'FECTH_FAIL', payload: getError(err)})
            }
        }
        fecthData();
    },[page, userInfo]);

    return (
    <div>
        <Helmet>
            <title>Produse</title>
        </Helmet>
        <h1 className='mb-3'>Toate Produsele</h1>
        { loading 
            ? (<LoadingBox />) 
            : error ? <Messagebox variant="danger">{error}</Messagebox> 
            : 
            products.lenght !== 0 ? (
                <>
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Nume</th>
                            <th>Pretul</th>
                            <th>In stok</th>
                            <th>Category</th>
                            <th>Brand</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((item,i) => (
                                <tr key={item._id}>
                                    <td>{i}</td>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price}RON</td>
                                    <td>{item.countInStock} produse</td>
                                    <td>{item.category}</td>
                                    <td>{item.brand}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                
                <div className='d-flex'>
                    {
                        [...Array(pages).keys()].map((x) => (
                            <Link
                                key={x + 1}
                                className={x + 1 === Number(page) ? 'text-bold me-2' : 'me-2' }
                                to={`/admin/products?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))
                    }
                </div>
                </>
            ) 
            : 'Nu exista nici un produs!'}
    </div>
    )
}
