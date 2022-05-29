import React, { useState } from 'react'
import { useContext } from 'react';
import { Store } from '../Store';
import {Container, Navbar, NavDropdown, Dropdown, Nav, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {LinkContainer} from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import FilterMenu from './FilterMenu';

export default function Header() {

	const {state, dispatch: ctxDispatch} = useContext(Store);
	const { cart, userInfo } = state;

	const [openFilter, setOpenFilter] = useState(false);
	console.log(openFilter);

	const signOutHandler = () => {
		ctxDispatch({type:'USER_SIGN_OUT'});
		localStorage.removeItem('userInfo');
		localStorage.removeItem('shippingAddress');
		localStorage.removeItem('paymentMethod');
	}

	const closeFilterHandler = (e) => {
		if(e.target.className !== 'filter__menu'){
			setOpenFilter(!openFilter);
		}
	}

return (
	<header className="header">
		<Container>
			<Navbar expand="md" className='justify-content-between'>
				<div className='d-flex align-items-center'>
					<FontAwesomeIcon icon={faBars} size="lg" className='me-3 mt-1' onClick={() => setOpenFilter(!openFilter)} />
					<div className='logo'>
						<Link to='/'>Eoomi</Link>	
					</div>
				</div>
				<div className='d-flex'>
					<Link className='cart' to={'/cart'}>Coș
						{cart.cartItems.length > 0 && (
							<div className='bage--box'>{cart.cartItems.reduce((a,c) => a + c.quantity,0)}</div>
						)}
					</Link>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse className='justify-content-end' id="basic-navbar-nav">
						<Nav>
							{userInfo ? (
								<NavDropdown className="text-white" title={userInfo.name} id="basic-nav-dropdown">
									<LinkContainer to="/orderhistory">
										<NavDropdown.Item>Order History</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to="/users/profile">
										<NavDropdown.Item>User Profile</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to="/#signout">
										<Dropdown.Item onClick={signOutHandler} >Sign Out</Dropdown.Item>
									</LinkContainer>
								</NavDropdown>
								) : (
									<div className='nav__signin'>
										<Link to='/signin'>Autentificare</Link>
									</div>
								)
							}
						</Nav>
					</Navbar.Collapse>
					{userInfo && userInfo.isAdmin ? (
						<div className='admin__menu'>
							<NavDropdown className='text-white' title="Admin">
								<LinkContainer to="/admin/dashboard">
									<NavDropdown.Item>Dashboard</NavDropdown.Item>
								</LinkContainer>
								<LinkContainer to="/admin/products">
									<NavDropdown.Item>Produse</NavDropdown.Item>
								</LinkContainer>
							</NavDropdown>
						</div>
					) : ''}
				</div>
			</Navbar>
			<div className={openFilter ? 'filter filter--active' : 'filter'} onClick={closeFilterHandler}>
				<FilterMenu value={openFilter} valueChanged={setOpenFilter} />
			</div>
		</Container>
	</header>
	)
}
