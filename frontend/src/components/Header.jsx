import React, { useState } from 'react'
import { useContext } from 'react';
import { Store } from '../Store';
import {Container, Navbar, NavDropdown, Dropdown, Nav} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faTimes, faFilter,faSunPlantWilt, 
		faUserPen, faRightFromBracket, 
		faUserLarge, faUserGear, faCartShopping, faIdCardClip,
		faBasketShopping,faChartSimple,faPersonWalkingArrowLoopLeft,faHouseUser
		} from '@fortawesome/free-solid-svg-icons';
import {LinkContainer} from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import FilterMenu from './FilterMenu';
import SearchBox from './SearchBox';

export default function Header() {

	// Citim din store
	const {state, dispatch: ctxDispatch} = useContext(Store);
	const { cart, userInfo } = state;

	// Definim starea initial a  buttonului care deschide filtru
	const [openFilter, setOpenFilter] = useState(false);
	const [hideToggleMenu, setHideToggleMenu] = useState(false);

	// Deschidem filtru, schimbam state
	const signOutHandler = () => {
		ctxDispatch({type:'USER_SIGN_OUT'});
		localStorage.removeItem('userInfo');
		localStorage.removeItem('shippingAddress');
		localStorage.removeItem('paymentMethod');
	}

	// Inchidem filtru
	const closeFilterHandler = (e) => {
		if(e.target.className !== 'filter__menu'){
			setOpenFilter(!openFilter);
		}
	}

	// Inchidem meniul
	const closeMobileMenuHandler = (e) => {
		if(e.target.className === 'mobile-menu mobile-menu--show'){
			setHideToggleMenu(!hideToggleMenu);
		}
	}

	// Render jsx 
	return (

	// Header
	<header className="header">
		<Container>
			<Navbar expand="md" className='justify-content-between'>
				<div className='d-flex align-items-center w-100'>
					<div className='mt-6' onClick={() => setOpenFilter(!openFilter)}>
						<FontAwesomeIcon icon={faFilter} size="lg" className='me-3' />
					</div>
					<div className='logo'>
						<Link to='/'>Eoomi</Link>	
					</div>

					{/* Search box componenta */}
					<SearchBox />

				</div>
				<div className='d-flex'>
					<Link className='cart' to={'/cart'}>
						<FontAwesomeIcon icon={faCartShopping} className='me-3' />
						Coș
						{cart.cartItems.length > 0 && (
							<div className='bage--box'>{cart.cartItems.reduce((a,c) => a + c.quantity,0)}</div>
						)}
					</Link>
						<Nav>
							<div className='show-menu__button' onClick={() => setHideToggleMenu(true)}>
								<FontAwesomeIcon icon={faBars} className='' />
							</div>
							<div className={hideToggleMenu ? 'mobile-menu mobile-menu--show' : 'mobile-menu mobile-menu--hide'}
								onClick={closeMobileMenuHandler}
							>
								<div className="mobile-menu--inner">
									<div className='logo logo--mobile'>
										<Link to='/'>Eoomi</Link>
										<FontAwesomeIcon icon={faTimes} onClick={() => setHideToggleMenu(false)} />
									</div>
									{userInfo ? (
										<NavDropdown className="text-white user__menu"  
											title={<><FontAwesomeIcon icon={faUserLarge} className='me-2' />  {userInfo.name}</>} 
											id="basic-nav-dropdown"
											open={true}
										>
											<LinkContainer to="/orderhistory">
												<NavDropdown.Item><FontAwesomeIcon icon={faSunPlantWilt} className='me-2 mt-1' />
													 Istoric comenzii
												</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/users/profile">
												<NavDropdown.Item><FontAwesomeIcon icon={faUserPen} className='me-2 mt-1' />
													Profilul meu
												</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/#signout">
												<Dropdown.Item onClick={signOutHandler}>
													<FontAwesomeIcon icon={faPersonWalkingArrowLoopLeft} className='me-2 mt-1' />
													Delegoare
												</Dropdown.Item>
											</LinkContainer>
										</NavDropdown>
										) : (
											<div className='nav__signin'>
												<Link to='/signin' className='d-flex'>            
													<FontAwesomeIcon icon={faRightFromBracket} className='me-1 mt-1' /> Autentificare
												</Link>
											</div>
										)
									}
									{userInfo && userInfo.isAdmin ? (
										<div className='admin__menu'>
											<NavDropdown className='text-white' 
												title={<><FontAwesomeIcon icon={faUserGear} className='me-2' />  Admin</>}
											>
												<LinkContainer to="/admin/dashboard">
													<NavDropdown.Item>
														<FontAwesomeIcon icon={faChartSimple} className='me-2' /> Dashboard 
													</NavDropdown.Item>
												</LinkContainer>
												<LinkContainer to="/admin/products">
													<NavDropdown.Item>
													<FontAwesomeIcon icon={faBasketShopping} className='me-2' /> Produse
													</NavDropdown.Item>
												</LinkContainer>
												<LinkContainer to="/admin/orders">
													<NavDropdown.Item>
														<FontAwesomeIcon icon={faIdCardClip} className='me-2' /> Comenzi
													</NavDropdown.Item>
												</LinkContainer>
												<LinkContainer to="/admin/users">
													<NavDropdown.Item>
														<FontAwesomeIcon icon={faHouseUser} className='me-2' /> Ultilizatori
													</NavDropdown.Item>
												</LinkContainer>
											</NavDropdown>
										</div>
									) : ''}
								</div>
							</div>
						</Nav>
				</div>
			</Navbar>
			<div className={openFilter ? 'filter filter--active' : 'filter'} onClick={closeFilterHandler}>
				<FilterMenu value={openFilter} valueChanged={setOpenFilter} />
			</div>
		</Container>
	</header>
	)
}
