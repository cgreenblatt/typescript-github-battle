import React from 'react';
import PropTypes from 'prop-types';
import useHover from '../hooks/useHover';

const container = {
  position: 'relative',
  display: 'flex',
} as React.CSSProperties;

export default function Tooltip({
  children,
  element,
}: {
  children: React.ReactNode;
  element: React.ReactNode;
}) {
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
