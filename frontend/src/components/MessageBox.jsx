import React from 'react';
import { Alert } from 'react-bootstrap';

const Messagebox = (props) => {
    return (
        <Alert variant={props.variant} className="alert__box py-1 m-0">
            {props.children}
        </Alert>
    );
}

export default Messagebox;
