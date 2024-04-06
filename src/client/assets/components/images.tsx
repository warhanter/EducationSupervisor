import React from "react";
import femaleImage from "../imgs/female-student.png";
import maleImage from "../imgs/student.png";

export function MaleImage() {
  return (
    <img
      className="inline-block size-[38px] rounded-full"
      src={maleImage}
      alt="تلميذ"
    />
  );
}
export function FemaleImage() {
  return (
    <img
      className="inline-block size-[38px] rounded-full"
      src={femaleImage}
      alt="تلميذ"
    />
  );
}
