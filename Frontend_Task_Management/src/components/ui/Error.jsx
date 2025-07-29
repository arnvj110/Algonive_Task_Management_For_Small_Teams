import React from 'react'

const Error = ({message}) => {
  return (
    <div className='flex  w-full  bg-red-100 min-h-[45px] text-center text-red-400 font-bold rounded-md gap-4 mb-3 '>
        <span className='rounded-l-md min-w-[5px] bg-red-500 border min-h-[100%] '>

        </span>
        <span className='  flex items-center'>
      {message}
            </span>
    </div>
  )
}

export default Error
