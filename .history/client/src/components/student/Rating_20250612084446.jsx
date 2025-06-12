import React from 'react'

function Rating() {
  return (
    <div>{Array.from((length:5),(_,index)=>{
      const starValue=index + 1;
    })}</div>
  )
}

export default Rating