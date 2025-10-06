import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { LECTURE_API_END_POINT } from "../../utils/apiEndPoints";
import { Link } from "react-router-dom";
import BackButton from "../BackButton.jsx";

const LectureList = ({ courseId, lectures, refreshLectures }) => {

  const handleDelete = async (lectureId) => {
    try {
      await axios.delete(
        `${LECTURE_API_END_POINT}/${courseId}/lectures/${lectureId}`,
        { withCredentials: true }
      );
      toast.success("Lecture deleted successfully");
      refreshLectures();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecture");
    }
  };

  if (!lectures?.length)
    return <p className="text-gray-400 text-center">No lectures added yet.</p>;

  return (
    <div className="mt-4">
      <div>
        <BackButton />
      </div>
      <h2 className="text-lg font-semibold mb-2">Lectures</h2>
      <div className="flex flex-col gap-3">
        {lectures.map((lecture, index) => (
          <div
            key={lecture._id}
            className="p-3 border rounded-lg flex justify-between items-center bg-base-100"
          >
            <div>
              <Link to={`/${courseId}/lecture/${lecture._id}`}>
                <p className="font-medium">
                  {index + 1}. {lecture.title}
                </p>
              </Link>
              <p className="text-sm text-gray-500">{lecture?.description}</p>
            </div>
            <button
              onClick={() => handleDelete(lecture._id)}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LectureList;
