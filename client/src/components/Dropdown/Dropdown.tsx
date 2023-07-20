import React, { useEffect, useRef } from "react";

import "./Dropdown.css";

function Dropdown(props: any) {
  const handleClick = (event: any) => {
    if (props.passRef && !props.passRef.current?.contains(event.target) && props.onClose)
      props.onClose();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <div className={`dropdown custom-scroll ${props.class ? props.class : ""}`}>
      {props.children}
    </div>
  );
}

export default Dropdown;
