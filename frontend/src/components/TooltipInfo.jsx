import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import imageInfo from '../images/info.svg';

export default function TooltipInfo(props) {
  return (
    <>
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{props.message}</Tooltip>}
        >
            <img src={imageInfo} alt="info" />
        </OverlayTrigger>
    </>
  )
}
