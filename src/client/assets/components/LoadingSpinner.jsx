import React from "react";
import { Spinner } from "react-bootstrap";
const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner animation="grow" variant="primary" role="status" size="xl" />
      <Spinner animation="grow" variant="secondary" role="status" />
      <Spinner animation="grow" variant="success" role="status" />
      <Spinner animation="grow" variant="danger" role="status" />
      <Spinner animation="grow" variant="warning" role="status" />
      <Spinner animation="grow" variant="info" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
