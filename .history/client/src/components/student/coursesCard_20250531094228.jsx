import React, { useContext } from 'react';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
    const { currency,caculateRating } = useContext(AppContext);

    return (
        <Link to={'/course/'+course._id} onClick={()=>scrollTo(0,0,)}className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg">
            <img
                src={course.courseThumbnail}
                alt={course.courseName}
                className="w-full"
            />
        <div className='p-3 text-left'>
                <h3 className="text-base font-semibold">{course.courseName}</h3>
                <p className="text-gray-500"> {course.dummyEducatorData?.name || "Instructor name not available"}</p>

                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-yellow-600">{caculateRating(course)}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <img key={i} src={i<Math.floor(caculateRating(course))?assets.star:assets.star_blank} alt="star" className="w-4 h-4" />
                        ))}
                    </div>
                    <p className="text-gray-500">(22)</p>
                </div>

                <p className="text-base font-semibold text-gray-800">
                    {currency}
                    {(
                        course.coursePrice -
                        (course.discount * course.coursePrice) / 100
                    ).toFixed(2)}
                </p>
        </div>
        </Link>
    );
}

export default CourseCard;
