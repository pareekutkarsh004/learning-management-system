import React from 'react'
import { dummyTestimonial } from '../../assets/assets'
import assets from '../../assets/assets';

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
      {dummyTestimonial.map((testimonial, index) => (<div key={index} className='text-sm text-left ' >
        <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
          <img src={testimonial.image} alt={testimonial.name}  className='h-12 w-12 rounded-full'/>
          <div >
            <h1 className='text-lg font-medium text-gray-800' >
              {testimonial.name}
            </h1>
            <p className='text-gray-800/80 '>
              {testimonial.role}
              </p>
          </div>
          <div className='p-5 pb-7'>
            <div className='flex  gap-0.5'>
              {[...Array(5).map((_,i=>{
                <img key={i} src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank
              }  alt='star' className='h-5'/>
              }))]}
            </div>
            <p className='text-gray-500 mt-5'>
              {testimonial.feedback}</p>
          </div>
        </div>
      </div>))}
    </div>
    </div>
  )
}

export default TestimonialSections