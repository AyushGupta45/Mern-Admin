import React from "react";
import { useSelector } from "react-redux";
import { FaWhatsapp } from "react-icons/fa";

const Whatsappicon = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    (!currentUser || !currentUser.isAdmin) && (
      <a
        href="https://wa.me/917303394627"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#36c641] w-14 h-14 fixed bottom-3 left-3 flex items-center justify-center cursor-pointer z-10"
        style={{ borderRadius: "50% 50% 50% 0" }}
      >
        <FaWhatsapp size={36} className="text-white" />
      </a>
    )
  );
};

export default Whatsappicon;

