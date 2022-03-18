import React from 'react';

const Messagebox = (props) => {
    return (
        <div className={'message-'+props.variant || 'info'}>
            {props.children}
        </div>
    );
}

export default Messagebox;
