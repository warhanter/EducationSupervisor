import React from "react";
import { Badge } from "react-bootstrap";

<Badge bg="danger">{`نصف داخلي : ${
  _.filter(absencesData, (student) => student.student_status === "نصف داخلي")
    .length
}`}</Badge>;

const BadgeComp = ({ bg, text, children, ...otherProps }) => {
  return (
    <h4>
      <Badge bg={bg} text={text} {...otherProps}>
        {children}
      </Badge>
    </h4>
  );
};

export default BadgeComp;
