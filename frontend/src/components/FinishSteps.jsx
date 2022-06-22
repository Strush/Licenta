import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBoxOpen,faHomeUser,faCircleDollarToSlot, faMapLocationDot} from '@fortawesome/free-solid-svg-icons';

export default function FinishSteps(props) {
  return (
    <Container>
      <Row className='finish-steps mb-4'>
        <Col className={props.step1 ? 'active' : ''}><FontAwesomeIcon icon={faHomeUser} /></Col>
        <Col className={props.step2 ? 'active' : ''}><FontAwesomeIcon icon={faMapLocationDot} /></Col>
        <Col className={props.step3 ? 'active' : ''}><FontAwesomeIcon icon={faCircleDollarToSlot} /></Col>
        <Col className={props.step4 ? 'active' : ''}><FontAwesomeIcon icon={faBoxOpen} /></Col>
      </Row>
    </Container>
  )
}
