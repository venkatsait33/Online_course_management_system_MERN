import React from 'react'

// {
//     "id": 1,
//         "title": "React for Beginners",
//             "instructor": "John Doe",
//                 "rating": 4.6,
//                     "students": 1250,
//                         "price": 499,
//                             "publishedDate": "2023-05-10",
//                                 "level": "Beginner",
//                                     "duration": "8 hours",
//   "image": "https://placehold.co/600x400/react-beginners.jpg"
// }

const BrowseCard = ({ course }) => {
    return (
        <div className='p-4'>

            <div className='card-body grid max-md:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-300 p-4 rounded-lg'>
                <h1>Title: <span>{course.title}</span></h1>
                <p>Instructor: <span>{course.instructor}</span></p>
                <h1>Rating: <span>{course.rating}</span></h1>
                <h1>Students: <span>{course.students}</span></h1>
                <h1>Price: <span>{course.price}</span></h1>
                <h1>Published Date: <span>{course.publishedDate}</span></h1>
                <h1>CourseLevel <span>{course.level}</span></h1>
                <h1>Course Duration: <span>{course.duration}</span></h1>

            </div>
        </div>
    )
}

export default BrowseCard