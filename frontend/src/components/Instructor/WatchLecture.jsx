import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { LECTURE_API_END_POINT } from "../../utils/apiEndPoints";
import { useCallback } from "react";
import BackButton from "../BackButton";

const WatchLecture = () => {
 
  const { courseId, lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const { data } = await axios.get(
          `${LECTURE_API_END_POINT}/${courseId}/lecture/${lectureId}`,
          { withCredentials: true }
        );
        setLecture(data.lecture);
        setViewed(true);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load lecture");
        setLoading(false);
      }
    };

    fetchLecture();
  }, [courseId, lectureId]);

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // Extract video ID
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (!match) return "";

    return `https://www.youtube.com/embed/${match[1]}`;
  };
  if (!getEmbedUrl) return <p>Invalid YouTube URL</p>;

  if (loading) return <p className="text-center mt-10">Loading lecture...</p>;
  if (!lecture)
    return <p className="text-center text-red-500">Lecture not found.</p>;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div>
        <BackButton />
      </div>
      <h1 className="text-2xl font-bold mb-4">{lecture.title}</h1>

      {/* Video Player */}
      <div className="mb-4 rounded-lg shadow-lg">
        <iframe
          width="100%"
          height="480px"
          src={getEmbedUrl(lecture?.videoUrl || 'https://www.youtube.com/watch?v=sUuLY8-LjKM&list=RDsUuLY8-LjKM&start_radio=1')}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        ></iframe>
      </div>
      
      {/* Description */}
      <p className="text-gray-700 mb-3">{lecture?.description || "No description provided."}</p>

      {/* Viewed Status */}
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 text-sm rounded-full ${viewed ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}
        >
          {viewed ? "✓ Marked as Viewed" : "Not Viewed"}
        </span>
      </div>
    </div>
  );
};

export default WatchLecture;
