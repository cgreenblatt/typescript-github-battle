import * as React from "react";
import PropTypes from "prop-types";
import useHover from '../hooks/useHover';

const container = {
  position: "relative",
  display: "flex",
};

export default function Tooltip({ children, element }) {
    const [hovering, attrs] = useHover();
    return (
        <div style={container} {...attrs}>
            {hovering === true && element}
            {children}
          </div>
        );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  element: PropTypes.node.isRequired,
};