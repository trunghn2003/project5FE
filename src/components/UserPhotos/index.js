import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  List,
  Divider,
  Typography,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import { fetchModel } from "../../lib/fetchModelData";
import { path } from "../../path";

const UserPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState({});
  const { userId } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserDataAndPhotos();
  }, [userId]);
  const fetchUserDataAndPhotos = async () => {
    try {
      const userPhotos = await fetchModel(
        `${path}photo/photosOfUser/${userId}`
      );
      const userInfo = await fetchModel(`${path}user/${userId}`);
      setPhotos(userPhotos || []);
      setUser(userInfo);
      setComments(
        userPhotos.reduce((acc, photo) => ({ ...acc, [photo._id]: "" }), {})
      );
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleAddComment = async (photoId) => {
    const commentText = comments[photoId];
    if (!commentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    const commentData = {
      comment: commentText,
    };

    const response = await fetch(`${path}photo/commentsOfPhoto/${photoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    if (response.ok) {
      await fetchUserDataAndPhotos(); // Refresh photos and user data after comment is added
      setComments({ ...comments, [photoId]: "" }); // Clear the comment input after successful submission
    } else {
      alert("Failed to post comment");
    }
  };

  const handleCommentChange = (photoId, value) => {
    setComments({ ...comments, [photoId]: value });
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      {photos.map((photo) => (
        <Grid item xs={12} sm={6} key={photo._id}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Link
                  to={`/users/${user._id}`}
                >{`${user.first_name} ${user.last_name}`}</Link>
              }
              subheader={new Date(photo.date_time).toLocaleString()}
              avatar={
                user && (
                  <Avatar style={{ backgroundColor: "#FF7F50" }}>
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </Avatar>
                )
              }
            />
            <CardMedia
              component="img"
              // image={
              //   photo.file_name && require(`../../images/${photo.file_name}`)
                
              // }
              image={photo.file_name ? `http://localhost:8081/uploads/${photo.file_name}` : undefined}
  alt={photo.file_name}
            />
            <CardContent>
              <Typography variant="subtitle1">Comments:</Typography>
              <Divider />
              {photo.comments.map((c) => (
                <List key={c._id}>
                  <Typography variant="subtitle2">
                    <Link
                      to={`/users/${c.user_id}`}
                    >{`${c.user.first_name} ${c.user.last_name}`}</Link>
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                  >
                    {new Date(c.date_time).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">{`"${c.comment}"`}</Typography>
                </List>
              ))}
              <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={comments[photo._id]}
                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddComment(photo._id)}
              >
                Post Comment
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserPhotos;
