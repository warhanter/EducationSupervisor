import React from "react";

export function TableCell({ children, ...props }) {
  return (
    <td className="border border-zinc-500 p-0.5" {...props}>
      {children}
    </td>
  );
}

export function TableHead({ children, ...props }) {
  return (
    <th className="border border-zinc-500 bg-gray-200 p-0.5" {...props}>
      {children}
    </th>
  );
}
