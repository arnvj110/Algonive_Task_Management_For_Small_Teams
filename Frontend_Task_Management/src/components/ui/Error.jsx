import React from 'react'

const Error = ({ message }) => {
  console.log("Error component received:", message);

  const displayMessage =
    typeof message === 'string'
      ? message
      : message?.message || 'An unknown error occurred';

  return (
    <div className='flex w-full bg-red-100 min-h-[45px] text-center text-red-400 font-bold rounded-md gap-4 mb-3'>
      <span className='rounded-l-md min-w-[5px] bg-red-500 border min-h-[100%]'></span>
      <span className='flex items-center'>
        {displayMessage}
      </span>
    </div>
  );
};

export default Error;
