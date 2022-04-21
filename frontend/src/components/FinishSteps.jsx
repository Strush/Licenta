import React from 'react'
import { Col, Row } from 'react-bootstrap'

export default function FinishSteps(props) {
  return (
    <Row className='finish-steps mb-30'>
      <Col className={props.step1 ? 'active' : ''}>Autentificare</Col>
      <Col className={props.step2 ? 'active' : ''}>Livrare</Col>
      <Col className={props.step3 ? 'active' : ''}>Achită</Col>
      <Col className={props.step4 ? 'active' : ''}>Finisează Comanda</Col>
    </Row>
  )
}
