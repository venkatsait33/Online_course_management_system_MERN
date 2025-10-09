import React from 'react'

const HomePage = () => {
    return (
        <div className=' container w-screen h-screen flex-col flex justify-center items-center mx-auto'>
            <h1>
                An Online Course Management System. The application should allow
            </h1>
            <ul>
                <li> ● Students: Browse courses, enroll, track progress.</li>
                <li> ● Instructors: Create, update, delete courses.</li>
                <li> ● Admins: Approve/reject courses and view analytics reports</li>
            </ul>
        </div>
    )
}

export default HomePage