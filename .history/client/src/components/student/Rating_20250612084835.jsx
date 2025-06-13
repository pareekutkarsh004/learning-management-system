import React from 'react'

function Rating() {
  const [rating, setRating] = React.useState(initialRating||0);
  return (
    <div>{Array.from((length:5),(_,index)=>{
      const starValue=index + 1;
      return (
        <span key={index} className={`text-xl sm:text-2xl cursor-pointer transition-colors${starValue <= rating}`}>
          &#9733; {/* Unicode star character */}
        </span>
      )
    })}</div>
  )
}

export default Rating