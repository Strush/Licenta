import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

export default function FinishSteps(props) {
  return (
    <Container>
      <Row className='finish-steps mb-4 mb-sm-5'>
        <Col className={props.step1 ? 'active' : ''}>Autentificare</Col>
        <Col className={props.step2 ? 'active' : ''}>Livrare</Col>
        <Col className={props.step3 ? 'active' : ''}>Achită</Col>
        <Col className={props.step4 ? 'active' : ''}>Plasează Comanda</Col>
      </Row>
    </Container>
  )
}
