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
  IconButton,
  Icon,
} from "@mui/material";
import { fetchModel } from "../../lib/fetchModelData";
import { path } from "../../path";

const UserPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState({});
  const [editCommentId, setEditCommentId] = useState(null); // State to track which comment is being edited
  const [editCommentText, setEditCommentText] = useState(""); // State to hold the new comment text during editing
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchUserDataAndPhotos();
  }, [userId]);

  const fetchUserDataAndPhotos = async () => {
    const userPhotos = await fetchModel(`${path}photo/photosOfUser/${userId}`);
    const userInfo = await fetchModel(`${path}user/${userId}`);
    setPhotos(userPhotos || []);
    setUser(userInfo);
    setComments(
      userPhotos.reduce((acc, photo) => ({ ...acc, [photo._id]: "" }), {})
    );
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
  const handleDeleteComment = async (photoId, commentId) => {
    const response = await fetch(
      `${path}photo/commentsOfPhoto/photo/${photoId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      alert("Comment deleted successfully");
      fetchUserDataAndPhotos();
    } else {
      alert("Failed to delete comment");
    }
  };

  const handleEditComment = (photoId, commentId, commentText) => {
    setEditCommentId(commentId);
    setEditCommentText(commentText);
  };

  const handleUpdateComment = async (photoId) => {
    if (!editCommentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    const response = await fetch(
      `${path}photo/commentsOfPhoto/photo/${photoId}/comment/${editCommentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: editCommentText }),
      }
    );

    if (response.ok) {
      alert("Comment updated successfully");
      setEditCommentId(null);
      setEditCommentText("");
      fetchUserDataAndPhotos();
    } else {
      alert("Failed to update comment");
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
              image={
                photo.file_name
                  ? `http://localhost:8081/uploads/${photo.file_name}`
                  : undefined
              }
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
                  {editCommentId === c._id ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                    />
                  ) : (
                    <Typography variant="body1">{`"${c.comment}"`}</Typography>
                  )}
                  {c.user_id === currentUser._id && (
                    <IconButton
                      onClick={() =>
                        handleEditComment(photo._id, c._id, c.comment)
                      }
                    >
                      Edit
                    </IconButton>
                  )}
                  {(c.user_id === currentUser._id ||
                    photo.user_id === currentUser._id) && (
                    <IconButton
                      onClick={() => handleDeleteComment(photo._id, c._id)}
                    >
                      Delete
                    </IconButton>
                  )}
                  {editCommentId === c._id && (
                    <IconButton onClick={() => handleUpdateComment(photo._id)}>
                      Save
                    </IconButton>
                  )}
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
