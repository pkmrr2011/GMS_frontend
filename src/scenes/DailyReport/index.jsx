import React, { useState, useEffect } from "react";
import "./DailyReport.css";
import dropImage from "../../components/images/download.png";
function DailyReport() {
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dailyImage, setDailyImage] = useState([]);

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
      setDailyImage([...dailyImage, backend]);

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
    const daily_images = [...dailyImage];
    newFiles.splice(index, 1);
    daily_images.splice(index, 1);
    setSelectedFiles(newFiles);
    setDailyImage(daily_images);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`media${index + 1}`, file);
    });

    try {
      const addDailyResponse = await fetch("/user/addDailyReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          daily_report_images: dailyImage,
          daily_report_comment: comment,
        }),
      });

      if (addDailyResponse.ok) {
        const data = await addDailyResponse.json();
        console.log(data);
        setComment("")
        setSelectedFiles([])
        setDailyImage([])
      } else if( addDailyResponse.status == 422){
        alert("Missing Fields")
      } 
      else {
        const errorData = await addDailyResponse.json();
        console.error("Error: ", errorData.error);
        alert(errorData.error)
        setComment("")
        setSelectedFiles([])
        setDailyImage([])
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.error)
    }
  };

  return (
    <div className="daily-report-container">
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

export default DailyReport;