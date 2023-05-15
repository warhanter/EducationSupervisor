import React from "react";
import "../styles/Dashboard.css";
import { MdPeopleAlt, MdArrowCircleLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({
  bgcolor,
  icon,
  title,
  subtitle,
  link,
  className,
  chidldren,
}) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ backgroundColor: bgcolor }}
      className={`cardContainer ${className}`}
    >
      <MdPeopleAlt className="icon" color="white" size={60} />
      {chidldren}
      <span className="cardTitle" color="white">
        {title}
      </span>
      <h5 className="cardText">{subtitle}</h5>
      <div onClick={() => navigate(link)} className="link">
        <span className="cardLink">دخول</span>
        <MdArrowCircleLeft className="arrowIcon" size={20} />
      </div>
    </div>
  );
};

export default DashboardCard;
