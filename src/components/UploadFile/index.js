import React, { useState } from "react";

function UploadPhoto() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch("http://localhost:8081/api/photo", {
      // Cập nhật endpoint
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("File uploaded successfully");
    } else {
      alert("Failed to upload file");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload Photo</button>
    </form>
  );
}

export default UploadPhoto;
