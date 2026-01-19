import React, { useRef } from "react";

const ProjectCard = ({ title, img, isLast }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  return (
    <div
      className="card"
      ref={containerRef}
      id={
        isLast
          ? "last-card"
          : `card-${title.replace(/\s+/g, "-").toLowerCase()}`
      }
    >
      <div className="card-wrapper">
        <div className="card-content">
          <div className="card-title">
            <h1 ref={titleRef}>{title}</h1>
          </div>
          <div className="card-description" ref={descriptionRef}>
            <p>
              A futuristic residence that plays with curvature and flow blending
              bold geometry with natural topography
            </p>
          </div>
        </div>
        <div className="card-img">
          <img src={img} alt={title} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
