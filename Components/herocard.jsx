import React from "react";

function HeroCard({ title, image }) {
  return (
    <div className="card">
      <div className="tag">
        <p>{title}</p>
      </div>
      <img className="stimg" src={image} alt="" />
    </div>
  );
}

export default HeroCard;
