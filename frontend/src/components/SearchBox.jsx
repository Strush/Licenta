import React, { useState } from 'react'
import { Button, Form, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch,faTimes} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';

export default function SearchBox() {

  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);

  const searchHandler = (e) => {
    e.preventDefault();
    navigate(value ? `/search?query=${value}` : '/search');
  }
  console.log(showSearch);
  return (
    <Form className="search-box w-100" onSubmit={searchHandler}>
      <div className={showSearch ? ' mobile-search-box--show' : 'mobile-search-box--hide'}>
        <FormControl
            type="search"
            name="search"
            placeholder="Caută ce dorești"
            className={'search-box__input me-2'}
            aria-label="search"
            onChange={((e) => setValue(e.target.value))}
        /> 
        <FontAwesomeIcon icon={faTimes} className="search-close--icon" onClick={() => setShowSearch(false)} />
      </div>
      <div className='ms-auto'>
        <Button type="submit" className='p-0' variant='' onClick={() => setShowSearch(!showSearch)}>
          <FontAwesomeIcon  icon={faSearch} className='me-3 mt-1' />
        </Button>
      </div>
    </Form>
  )
}
