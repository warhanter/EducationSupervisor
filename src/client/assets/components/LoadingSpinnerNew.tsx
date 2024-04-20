import { Loader } from "lucide-react";
import React from "react";

function LoadingSpinnerNew() {
  return (
    <div className="flex h-dvh justify-center content-center items-center">
      <p className="p-5 text-xl font-bold">يرجى الانتضار...</p>
      <Loader size={30} className="animate-spin" />
    </div>
  );
}

export default LoadingSpinnerNew;
