import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../../path";

function UploadPhoto() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(`${path}api/photo`, {
      // Cập nhật endpoint
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("File uploaded successfully");
      navigate(`/photos/${user._id}`)
      
    } else {
      alert("Failed to upload file");
    }
  };

  return (
    // them class de css
    <form className="upload-form" onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload Photo</button>
    </form>
  );
}

export default UploadPhoto;
