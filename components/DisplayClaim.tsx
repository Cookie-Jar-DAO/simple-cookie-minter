import React from "react";

export const DisplayClaim = ({
  heading,
  description,
  element,
}: {
  heading: string;
  description?: string;
  element?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col">
      <h2 className="mb-2">{heading}</h2>
      <h2 className="mb-2">{description}</h2>
      {element}
    </div>
  );
};
