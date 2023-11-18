import React, { useState, useEffect } from "react";
import "./IncidentReport.css";
import dropImage from "../../components/images/download.png";
function IncidentReport() {
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [incidentImage, setIncidentImage] = useState([]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    event.preventDefault();
    const formData = new FormData();
    formData.append("media", files[0]);
    try {
      const uploadResponse = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const uploadedImage = await uploadResponse.json();

      const backend = uploadedImage.filename;
      setIncidentImage([...incidentImage, backend]);

      files[0].backend = backend;

      setSelectedFiles([...selectedFiles, ...files]);
    } catch (error) {
      console.error("Error:", error);
      alert(error.error)
      return;
    }
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    const incident_images = [...incidentImage];
    newFiles.splice(index, 1);
    incident_images.splice(index, 1);
    setSelectedFiles(newFiles);
    setIncidentImage(incident_images);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`media${index + 1}`, file);
    });

    try {
      const addIncidentResponse = await fetch("/user/addIncident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          incident_images: incidentImage,
          incident_comment: comment,
        }),
      });

      if (addIncidentResponse.ok) {
        const data = await addIncidentResponse.json();
        console.log(data);
        setComment("")
        setSelectedFiles([])
        setIncidentImage([])
      } else if (addIncidentResponse.status == 422){
        alert("Missing Field")
      } 
      else {
        const errorData = await addIncidentResponse.json();
        console.error("Error: ", errorData.message);
        alert(errorData.error)
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.error)
    }
  };

  return (
    <div className="incident-report-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="images" className="add-image-label">
          <input
            type="file"
            id="media"
            name="media"
            multiple
            className="hidden-input"
            onChange={handleImageChange}
          />

          <div className="div" onClick={handleImageChange}>
            <img src={dropImage} alt="drop" width="100" />
            <p className="paragraph">
              Drag and Drop Files or <span className="span">Browse</span>
            </p>
          </div>
        </label>

        {selectedFiles.map((file, index) => (
          <div key={index} className="image-box">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="image-preview"
            />
            <div className="remove-button" onClick={() => removeImage(index)}>
              &times; {/* "x" character for close icon */}
            </div>
          </div>
        ))}

        <label htmlFor="comment">Comment:</label>
        <input
          type="text"
          id="comment"
          name="comment"
          value={comment}
          onChange={handleCommentChange}
        />

        <button type="submit">Submit with Images</button>
      </form>
    </div>
  );
}

export default IncidentReport;