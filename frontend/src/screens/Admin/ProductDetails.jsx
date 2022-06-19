import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Button, Form, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox';
import Messagebox from '../../components/MessageBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import { Store } from '../../Store';
import getError from '../../utils';

const reducer = (state, action) => {
    switch(action.type){
        case "FETCH_REQUEST": 
            return {...state, loading: true}
        case "FETCH_SUCCESS":
            return {...state, loading: false}
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload}

        case "UPDATE_REQUEST":
            return {...state, Updateloading: true}
        case "UPDATE_SUCCESS":
            return {...state, Updateloading: false}
        case "UPDATE_FAIL":
            return {...state, Updateloading: false}

        case "UPLOAD_REQUEST":
            return {...state, Uploadloading: true, uploadError: ''}
        case "UPLOAD_SUCCESS":
            return {...state, Uploadloading: false, uploadError: ''}
        case "UPLOAD_FAIL":
            return {...state, Uploadloading: false, uploadError: action.payload}

        default: {
            return state;
        }
    }
}

export default function ProductDetails() {
    const navigate = useNavigate();
    const {id: productId} = useParams();
    const {state} = useContext(Store);
    const {userInfo} = state;

    const [{loading, error,Updateloading,Uploadloading}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [rating, setRating] = useState('');
    const [numReviews, SetNumReviews] = useState('');

    useEffect(() => {
        const fecthData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const { data } = await axios.get(`/api/products/${productId}`);
                setName(data.name);
                setSlug(data.slug);
                setImage(data.image);
                setImages(data.images);
                setBrand(data.brand);
                setCategory(data.category);
                setDescription(data.description);
                setPrice(data.price);
                setCountInStock(data.countInStock);
                setRating(data.rating);
                SetNumReviews(data.numReviews);
                dispatch({type: 'FETCH_SUCCESS'});

            } catch (err) {
                dispatch({type: 'FETCH_FAIL'});
                toast.error(getError(err));
            }
        }
         fecthData();
    }, [productId]);

    const updateProductHandler = async (e) => {
        e.preventDefault();

        try {
            dispatch({type: 'UPDATE_REQUEST'});
            await axios.put(`/api/products/${productId}`, {
                _id: productId,
                name,
                slug,
                image,
                images,
                brand,
                category,
                description,
                price,
                countInStock,
                rating,
                numReviews
            }, {
                headers: {
                    Authorization: `Berear ${userInfo.token}`
                }
            });
            dispatch({type: 'UPDATE_SUCCESS'});
            toast.success('Produsul a fost modificat cu success');
            navigate('/admin/products');
        } catch(err) {
            dispatch({type: 'UPDATE_FAIL'});
            toast.error(getError(err))
        }
    }

    const uploadImageFile = async (e, fromImages) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData;
        bodyFormData.append('file',file);
        try {
            dispatch({type: 'UPLOAD_REQUEST'});
            const {data} = await axios.post('/api/upload',bodyFormData, {
                headers :{
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                }
            });
            dispatch({type: 'UPLOAD_SUCCESS'});
    
            if(fromImages){
                setImages([...images, data.secure_url]);
            } else {
                setImage(data.secure_url);
            }
            toast.success('Imaginea a fost incarcata cu success.');

        } catch(err){
            toast.error(err);
            dispatch({type: 'UPLOAD_FAIL', payload: getError(err)});
        }
    }

    const deleteImageHandler = async (fileName) => {
        setImages(images.filter((image) => image !== fileName));
        toast.success('Imaginea a fost stearsa cu success');
    }

    return (
    <div className='product-details small-container'>
        <Helmet>
            <title>
                Podusul: {productId}
            </title>
        </Helmet>
        <h2 className='mb-4'>Produsul: {productId}</h2>
        {loading ? <LoadingBox /> 
        : error ? (<Messagebox>{error}</Messagebox>) 
        : (
        <Form className="form" onSubmit={updateProductHandler}>
            <Form.Group controlId="name" className='mb-3 mb-sm-4'>
                <Form.Label>Nume</Form.Label>
                <Form.Control 
                    type="text"
                    value={name}
                    onChange={((e) => setName(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="slug" className='mb-3 mb-sm-4'>
                <Form.Label>Slug</Form.Label>
                <Form.Control 
                    type="text"
                    value={slug}
                    onChange={((e) => setSlug(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="image" className='mb-3 mb-sm-4'>
                <Form.Label>Imagine</Form.Label>
                <Form.Control 
                    type="text"
                    value={image}
                    onChange={((e) => setImage(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="uploadImage" className='mb-3 mb-sm-4'>
                <Form.Label>Incarca o Imagine</Form.Label>
                <Form.Control 
                    type="file"
                    onChange={uploadImageFile}
                />
                {Uploadloading && <LoadingBox />}
            </Form.Group>

            <Form.Group controlId="gallery" className='mb-3 mb-sm-4'>
                <Form.Label>Galerie</Form.Label>
                {console.log(images)}
                {images.length === 0 && <Messagebox>Nu ai incarcat nici o imagine in galerie</Messagebox>}
                <ListGroup variant='flush'>
                    {
                        images.map((image) => (
                            <ListGroup.Item key={image}>
                                {image}
                                <FontAwesomeIcon icon={faTimes} className='me-2'
                                    onClick={() => deleteImageHandler(image)}
                                />

                            </ListGroup.Item>
                        ))
                    }

                </ListGroup>
            </Form.Group>
            <Form.Group controlId="uploadGallery" className='mb-3 mb-sm-4'>
                <Form.Label>Incarca o galerie de imagini</Form.Label>
                <Form.Control 
                    type="file"
                    onChange={(e) => uploadImageFile(e,true)}
                />
                {Uploadloading && <LoadingBox />}
            </Form.Group>

            <Form.Group controlId="brand" className='mb-3 mb-sm-4'>
                <Form.Label>Brand</Form.Label>
                <Form.Control 
                    type="text"
                    value={brand}
                    onChange={((e) => setBrand(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="category" className='mb-3 mb-sm-4'>
                <Form.Label>Category</Form.Label>
                <Form.Control 
                    type="text"
                    value={category}
                    onChange={((e) => setCategory(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="description" className='mb-3 mb-sm-4'>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3}
                    value={description}
                    onChange={((e) => setDescription(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="price" className='mb-3 mb-sm-4'>
                <Form.Label>Pretul</Form.Label>
                <Form.Control
                    type="number"
                    value={price}
                    onChange={((e) => setPrice(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="countInStock" className='mb-3 mb-sm-4'>
                <Form.Label>In stock</Form.Label>
                <Form.Control
                    type="number"
                    value={countInStock}
                    onChange={((e) => setCountInStock(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="rating" className='mb-3 mb-sm-4'>
                <Form.Label>Rating</Form.Label>
                <Form.Control
                    type="number"
                    value={rating}
                    onChange={((e) => setRating(e.target.value))}
                    required 
                />
            </Form.Group>
            <Form.Group controlId="numReviews" className='mb-3 mb-sm-4'>
                <Form.Label>Numarul de vizualizari</Form.Label>
                <Form.Control
                    type="number"
                    value={numReviews}
                    onChange={((e) => SetNumReviews(e.target.value))}
                    required 
                />
            </Form.Group>
            <Button 
                variant="primary w-100 mb-2" 
                type="submit"
                disabled={Updateloading}
            >
                Modifica 
                {Updateloading && <LoadingBox/>}
            </Button>
        </Form>
        )}
    </div>
    )
}
