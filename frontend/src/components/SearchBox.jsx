import React, { useState } from 'react'
import { Button, Form, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';

export default function SearchBox() {

  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    navigate(value ? `/search?query=${value}` : '/search');
  }

  return (
    <Form className="search-box w-100" onSubmit={searchHandler}>
        <FormControl
            type="search"
            name="search"
            placeholder="Caută ce dorești"
            className="search-box__input me-2"
            aria-label="search"
            onChange={((e) => setValue(e.target.value))}
        />
        <div>
          <Button type="submit" variant=''>
            <FontAwesomeIcon  icon={faSearch} className='me-3 mt-1' />
          </Button>
        </div>
    </Form>
  )
}
