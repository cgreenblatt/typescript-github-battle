import React, { useState } from "react";

export default function useHover(): [boolean, { onMouseOver: () => void, onMouseOut: () => void }] {
    const [hovering, setHovering] = useState(false);
    const onMouseOver = () => setHovering(true);
    const onMouseOut = () => setHovering(false);
    return [hovering, { onMouseOver, onMouseOut }];
}