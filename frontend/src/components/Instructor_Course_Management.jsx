import { courseData } from "../utils/sampleData";

const Instructor_Course_Management = () => {
    return (
        <div className="p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Instructor Name</h1>
                <button className="btn btn-primary">Publish Course</button>
            </div>

            {/* Stats Section */}
            <div className="flex gap-4 items-center max-sm:flex-col justify-between">
                <div className="btn btn-accent btn-dash flex justify-between w-full max-w-xs">
                    <p>No. of Courses Published:</p>
                    <p>10</p>
                </div>
                <div className="btn btn-secondary btn-dash flex justify-between w-full max-w-xs">
                    <p>Students Enrolled:</p>
                    <p>100</p>
                </div>
                <div className="btn btn-info btn-dash flex justify-between w-full max-w-xs">
                    <p>Unpublished Courses:</p>
                    <p>2</p>
                </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto mt-4">
                <table className="table">
                    {/* Head */}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Instructor</th>
                            <th>Level</th>
                            <th>Published Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseData.map((course) => (
                            <tr key={course.id} className="hover:bg-base-300">
                                <th>{course.id}</th>
                                <td>{course.title}</td>
                                <td>{course.instructor}</td>
                                <td>{course.level}</td>
                                <td>{course.publishedDate}</td>
                                <td>
                                    {/* ✅ Working Dropdown */}
                                    <div className="dropdown dropdown-end">
                                        <button
                                            tabIndex={0}
                                            className="btn btn-sm  m-1"
                                        >
                                            ...
                                        </button>
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow"
                                        >
                                            <li>
                                                <button>Publish</button>
                                            </li>
                                            <li>
                                                <button>Remove</button>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Instructor_Course_Management;
