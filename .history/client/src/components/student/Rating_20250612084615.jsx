import React from 'react'

function Rating() {
  return (
    <div>{Array.from((length:5),(_,index)=>{
      const starValue=index + 1;
      return (
        <span key={index} className={`text-xl sm:text-2xl cursor-pointer tran`}>
          &#9733; {/* Unicode star character */}
        </span>
      )
    })}</div>
  )
}

export default Rating