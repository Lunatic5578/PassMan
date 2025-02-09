import React from "react";

export default function Footer() {
  return (
    <div className="flex bg-slate-800 text-white">
    <div className="ml-14 flex flex-col justify-center items-center w-full py-2">
      <div className="logo font-bold text-xl">
        <span className="text-purple-600">&lt;</span>
        <span className='text-white'>Pass</span>
        <span className="text-purple-600">MAN/&gt;</span>
      </div>
      <div className="flex justify-center items-center">Created with MERN@2024 by ZM</div>
    </div>
    <button className='text-wheat bg-purple-700 my-5 mx-2 pr-3 rounded-full flex justify-between mr-8 items-center ring-white ring-1  hover:bg-purple-900'> 
        <img className="w-10 invert" src="../icons/navlogo.png" alt="github logo" />
        <a href="https://github.com/Lunatic5578" target="_blank" className='font-bold pr-2'>Github</a>
    </button>
    </div>
  );
}
