import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Goes to the previous page in history
  };

  return (
    <button 
      onClick={handleBack} 
      className="btn btn-outline"
    >
      Go Back
    </button>
  );
};

export default BackButton;
