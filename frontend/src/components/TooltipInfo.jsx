import React from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import imageInfo from '../images/info.svg';

export default function TooltipInfo(props) {
  return (
    <div>
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{props.message}</Tooltip>}
        >
            <img src={imageInfo} alt="info" />
        </OverlayTrigger>
    </div>
  )
}
