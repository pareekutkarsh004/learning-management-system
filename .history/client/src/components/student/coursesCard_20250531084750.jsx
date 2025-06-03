import React, { useContext } from 'react';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
    const { currency } = useContext(AppContext);

    return (
        <Link to={'/course/'+course._id} onClick={()=>scrollTo(0,0,)}className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg
        ">
            <img
                src={course.courseThumbnail}
                alt={course.courseName}
                className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold">{course.courseName}</h3>
            <p className="text-sm text-gray-600"> {course.dummyEducatorData?.name || "Instructor name not available"}</p>

            <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-yellow-600">4.5</p>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <img key={i} src={assets.star} alt="star" className="w-4 h-4" />
                    ))}
                </div>
                <p className="text-sm text-gray-500">(22)</p>
            </div>

            <p className="text-base font-bold text-blue-700">
                {currency}
                {(
                    course.CoursePrice -
                    (course.discount * course.CoursePrice) / 100
                ).toFixed(2)}
            </p>
        </Link>
    );
}

export default CourseCard;
