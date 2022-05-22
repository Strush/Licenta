import React from 'react'
import { useContext } from 'react';
import { Store } from '../Store';
import {Container, Navbar, NavDropdown, Dropdown, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

export default function Header() {

	const {state, dispatch: ctxDispatch} = useContext(Store);
	const { cart, userInfo } = state;

	const signOutHandler = () => {
		ctxDispatch({type:'USER_SIGN_OUT'});
		localStorage.removeItem('userInfo');
		localStorage.removeItem('shippingAddress');
		localStorage.removeItem('paymentMethod');
	}

return (
	<header className="header">
		<Container>
			<Navbar expand="md" className='justify-content-between'>
				<div className='logo'>
					<Link to='/'>Eoomi</Link>
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
				</div>
			</Navbar>
		</Container>
	</header>
	)
}
