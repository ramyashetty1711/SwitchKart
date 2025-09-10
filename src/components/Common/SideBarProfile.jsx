import React from "react";
import image from '../../assets/sidebar.png';

export default function SideBarProfile() {
  return (
    <div className="flex flex-col justify-start min-h-full bg-white dark:bg-black rounded-sm pt-4 px-2">
      <div className="relative h-40 w-full rounded-lg overflow-hidden">
        {/* Background Image */}
        <img
          src={image}
          alt="Profile Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay Text */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center">
          <h2 className="text-lg font-semibold">Hello,</h2>
          <p className="text-xl font-bold">Arjun Mehta</p>
        </div>
      </div>
    </div>
  );
}
