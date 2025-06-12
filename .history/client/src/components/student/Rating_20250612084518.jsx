import React from 'react'

function Rating() {
  return (
    <div>{Array.from((length:5),(_,index)=>{
      const starValue=index + 1;
      return (
        <span key={index} className="text-yellow-500">
          
        </span>
      )
    })}</div>
  )
}

export default Rating