// "use client"

import React from "react";
import styles from "./ReactLogo.module.css";

const SmallReactLogo = async (userSession) => {

  // console.log(userSession)
  const user = await userSession?.userSession?.user?.name;

  return (
    <span style={{display:"flex" , justifyContent:"center" , alignItems:"center"}}>
      <svg
        className={styles.reactLogo}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 841.9 595.3"
      >
        <g fill="none" stroke="#61dafb" strokeWidth="30">
          <ellipse cx="420.9" cy="296.5" rx="355" ry="180" />
          <ellipse
            cx="420.9"
            cy="296.5"
            rx="355"
            ry="180"
            transform="rotate(60 420.9 296.5)"
          />
          <ellipse
            cx="420.9"
            cy="296.5"
            rx="355"
            ry="180"
            transform="rotate(120 420.9 296.5)"
          />
        </g>
        <circle cx="420.9" cy="296.5" r="50" fill="#61dafb" />
      </svg>
      <p style={{ marginLeft: "10px", color: "#61dafb", fontWeight: "bold" }}> {user ? `Hello, ${user}!` : "Hello, Guest!"} </p>
    </span>

  );
};

export default SmallReactLogo;
