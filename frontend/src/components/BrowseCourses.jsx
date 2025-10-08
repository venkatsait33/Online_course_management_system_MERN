import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllCourses } from "../hooks/useGetAllCourses";

const BrowseCourses = () => {
    const { loading, course } = useSelector((store) => store.course);
    useGetAllCourses();

    // 🧠 Filter states
    const [filters, setFilters] = useState({
        search: "",
        minPrice: "",
        maxPrice: "",
        minDuration: "",
        maxDuration: "",
        level: "",
        category: "",
    });

    // 🧮 Handle input changes
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // 🧹 Filter logic (client-side filtering)
    const filteredCourses = useMemo(() => {
        return course
            ?.filter((c) => {
                const matchesSearch = c.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase());
                const matchesLevel = filters.level
                    ? c.level === filters.level
                    : true;
                const matchesCategory = filters.category
                    ? c.category?.toLowerCase() === filters.category.toLowerCase()
                    : true;
                const matchesPrice =
                    (!filters.minPrice || c.price >= Number(filters.minPrice)) &&
                    (!filters.maxPrice || c.price <= Number(filters.maxPrice));
                const matchesDuration =
                    (!filters.minDuration || c.duration >= Number(filters.minDuration)) &&
                    (!filters.maxDuration || c.duration <= Number(filters.maxDuration));

                return (
                    matchesSearch &&
                    matchesLevel &&
                    matchesCategory &&
                    matchesPrice &&
                    matchesDuration
                );
            })
            .sort((a, b) => a.price - b.price);
    }, [course, filters]);

    if (loading) return <p>Loading your courses...</p>;
    if (course?.length === 0)
        return <p>You have not enrolled in any courses yet.</p>;

    return (
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 w-screen py-6">
            <h1 className="text-2xl font-bold text-center mb-4">🎓 Browse Courses</h1>
            <div className="flex ">
                {/* Filter Section */}
                <div className=" p-6 rounded-lg w-[20%] shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Filter Courses</h2>
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by title..."
                            value={filters.search}
                            onChange={handleChange}
                            className="input input-bordered w-full "
                        />

                        {/* Price Range */}
                        <div className="flex flex-col gap-2">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={handleChange}
                                className="input input-bordered w-full "
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={handleChange}
                                className="input input-bordered w-full "
                            />
                        </div>

                        {/* Duration Range */}
                        <div className="flex gap-2 flex-col">
                            <input
                                type="number"
                                name="minDuration"
                                placeholder="Min Duration"
                                value={filters.minDuration}
                                onChange={handleChange}
                                className="input input-bordered w-full "
                            />
                            <input
                                type="number"
                                name="maxDuration"
                                placeholder="Max Duration"
                                value={filters.maxDuration}
                                onChange={handleChange}
                                className="input input-bordered w-full "
                            />
                        </div>

                        {/* Level */}
                        <select
                            name="level"
                            value={filters.level}
                            onChange={handleChange}
                            className="select select-bordered w-full "
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>

                        {/* Category */}
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">All Categories</option>
                            <option value="React">React</option>
                            <option value="Node.js">Node.js</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="Python">Python</option>
                        </select>
                    </div>
                </div>

                {/* Filtered Results */}
                <div className="w-full">
                    <div className="flex flex-col gap-4">
                        {filteredCourses?.length > 0 ? (
                            filteredCourses.map((course) => (
                                <div
                                    key={course._id}
                                    className="p-4 shadow-xl rounded-lg overflow-hidden border bg-white"
                                >
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-xl font-bold text-gray-900">
                                            {course.title}
                                        </h1>
                                        <Link
                                            to={`/course/${course._id}`}
                                            className="btn btn-accent btn-sm"
                                        >
                                            View
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1 text-gray-800 mt-2">
                                        <p>Instructor: {course.instructorId?.fullname}</p>
                                        <p>Level: {course.level}</p>
                                        <p>Duration: {course.duration} </p>
                                        <p>Price: ${course.price}</p>
                                        <p>Students Enrolled: {course.students}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No courses found.</p>
                        )}
                    </div>
                </div>
            </div>

          
        </div>
    );
};

export default BrowseCourses;
