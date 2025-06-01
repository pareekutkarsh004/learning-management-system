import React from 'react'
import { dummyTestimonial } from '../../assets/assets'

function TestimonialSections() {
  return (
    <div className='pb-14 px-8 md:px-0'>
    <h2 className='text-3xl  font-medium text-gray-800 '>
      Testimonials
    </h2>
    <p className='text-gray-500 md:text-base mt-3'>
      Hear from our learners as they share their journey of the transfomation ,success and how our <br/>platform has made a difference in their lives.
    </p>
    <div>
      {dummyTestimonial.map((testimonial, index) => (<div key={index}>
        <div>
          <img src={testimonial.image} alt={testimonial.name} />
          <div >
            <h1>
              {testimonial.name}
            </h1>
            <p>
              {testimonial.role}
              </p>
          </div>
          <div>
            <div>
              {[...Array(5).map((_,i=>{
                <img key={i} src=i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank
              }  alt=''/>
              }))]}
            </div>
          </div>
        </div>
      </div>))}
    </div>
    </div>
  )
}

export default TestimonialSections