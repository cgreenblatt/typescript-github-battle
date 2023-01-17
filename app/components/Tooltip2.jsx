import React from 'react';
import PropTypes from 'prop-types';
import Hover from './Hover';

const container = {
    position: "relative",
    display: "flex",
}

export default function Tooltip2({ children, element }) {
    return (
        <Hover>
            {(hovering) => {
                    return (
                    <div style={container}>
                        {hovering && element}
                        {children}
                    </div>
                    )
            }}
        </Hover>
    )
}

Tooltip2.propTypes = {
    children: PropTypes.node.isRequired,
    element: PropTypes.node.isRequired,
}