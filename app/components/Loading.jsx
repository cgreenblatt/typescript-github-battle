import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const styles = {
  fontSize: "14px",
  position: "absolute",
  left: "0",
  right: "0",
  marginTop: "20px",
  textAlign: "center",
};

function useDelay(wait) {
  const [show, setShow] = useState(false);
  useEffect(() => {
      const timeout = setTimeout(() => setShow(true), wait);
      return () => clearTimeout(timeout);
    }, []);
  return [show];
}

export default function Loading({ speed = 300, text = 'loading'}) {
  const [show] = useDelay(300);
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = window.setInterval(() => {
          setDots((dots) => {
            return dots.length === 3
              ? '.'
              : dots.concat('.');
          })
    }, speed);
    return () => clearInterval(interval);
  }, [])
  return show
    ? <p style={styles}>{`${text} ${dots}`}</p>
    : null
}

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
};
