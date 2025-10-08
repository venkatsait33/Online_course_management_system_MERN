import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LECTURE_API_END_POINT } from "../../utils/apiEndPoints";

const AddLectureForm = ({ courseId, fetchCourse }) => {
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [description, setDescription] = useState("");


    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${LECTURE_API_END_POINT}/${courseId}/lectures`,
                { title, videoUrl, description, },
                { withCredentials: true }
            );
            toast.success("Lecture added successfully!");
            setTitle("");
            setVideoUrl("");
            setDescription("");
            fetchCourse();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add lecture");
        }
    };

    return (
        <form onSubmit={handleAdd} className="space-y-3 bg-base-100 shadow-2xl p-4 rounded-md">
            <input
                type="text"
                placeholder="Lecture Title"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Video URL"
                className="input input-bordered w-full"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
            />

            <textarea
                placeholder="Lecture Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full mb-2"
            />
            <button type="submit" className="btn btn-primary w-full">
                Add Lecture
            </button>
        </form>
    );
};

export default AddLectureForm;
