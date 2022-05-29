import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import getError from '../utils';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function FilterMenu() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get('/api/products/categories');
        setCategories(data)
      } catch (err) {
        toast.error(getError(err));
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className='filter__menu'>
        <h4 className='mb-3'>Filtreaza Produse</h4>
        <ul className="filter__categories ms-2">
          {categories.length !== 0 ?
            categories.map((cat) => (
              <li className='mb-2' key={cat}>
                  <Link to={`/search?category=${cat}`}>{cat}</Link>
              </li>
            )) : 'Nu exista categorie'
          }
        </ul>
      </div>
      <div className='filter__icon'>
        <FontAwesomeIcon icon={faTimes} size='2x' />
      </div>
    </>
  )
}
export default FilterMenu;