import { NavLink } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import React from "react";
import { academicServices } from "../constants";

const DropdowServices = () => {
  return (
    <Dropdown label="Services" inline>
      {academicServices.map((subject) => (
        <Dropdown.Item key={subject.name}>
          <NavLink
            to={`/services/${subject.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex items-center gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {React.createElement(subject.icon)} {subject.name}
          </NavLink>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

export default DropdowServices;
