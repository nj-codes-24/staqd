import React from 'react';

export default function Logo() {
  return (
    <div
      className="flex items-center cursor-pointer select-none group h-8"
      onClick={(e) => {
        e.preventDefault();
        window.location.reload();
      }}
    >
      {/* Left Orange Bracket */}
      <svg className="h-full w-auto shrink-0 transition-transform duration-500" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 12 4 H 4 V 36 H 12" stroke="#FF5500" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Dynamic Center Stage: Expands in place */}
      <div className="relative flex items-center justify-center transition-all duration-500 ease-in-out w-8 group-hover:w-28 h-full">

        {/* State 1: The 3 Bars (Visible by default, dissolves on hover) */}
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-75">
          <svg className="h-[80%] w-auto text-black dark:text-white" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 12 11 L 33 11 L 29 16 L 8 16 Z" fill="currentColor" />
            <path d="M 5 19 L 2 21 L 5 23 L 3 25 L 36 25 L 32 19 Z" fill="#FF5500" />
            <path d="M 10 28 L 31 28 L 27 33 L 6 33 Z" fill="currentColor" />
          </svg>
        </div>

        {/* State 2: STAQD Text (Hidden by default, fades in on hover) */}
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100">
          <svg className="h-[65%] w-auto text-black dark:text-white" viewBox="0 0 170 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              {/* S */}
              <path d="M 24 14 L 21 11 H 11 L 8 14 V 18 L 11 20 H 21 L 24 22 V 26 L 21 29 H 11 L 8 26" />
              {/* T */}
              <path d="M 40 11 H 56 M 48 11 V 29" />
              {/* A (Lambda) */}
              <path d="M 72 29 L 80 11 L 88 29" strokeLinecap="round" strokeLinejoin="round" />
              {/* Q */}
              <path d="M 108 11 H 116 L 120 15 V 25 L 116 29 H 108 L 104 25 V 15 Z" />
              <path d="M 116 25 L 122 31" strokeLinecap="round" />
              {/* D */}
              <path d="M 136 11 H 146 L 152 17 V 23 L 146 29 H 136 Z" />
            </g>
          </svg>
        </div>

      </div>

      {/* Right Orange Bracket */}
      <svg className="h-full w-auto shrink-0 transition-transform duration-500" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 2 4 H 10 V 36 H 2" stroke="#FF5500" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

    </div>
  );
}