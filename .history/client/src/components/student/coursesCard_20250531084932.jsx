import React, { useContext } from 'react';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
    const { currency } = useContext(AppContext);

    return (
        <Link to={'/course/'+course._id} onClick={()=>scrollTo(0,0,)}className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg">
            <img
                src={course.courseThumbnail}
                alt={course.courseName}
                className="w-full"
            />
        <
        </Link>
    );
}

export default CourseCard;
