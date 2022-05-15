import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className='footer'>
			<Container>
			<div className='content'>
				<div className='footer__log'>
					<Link to='/'>Eoomi</Link>
				</div>
				<div className='footer__nav'>
					<p className='copyright'>Eoomi &copy;, Toate drepturile au fost rezervate.</p>
				</div>
			</div>
			</Container>
  </footer>
  )
}
