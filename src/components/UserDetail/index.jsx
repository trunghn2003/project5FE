import React, { useState, useEffect } from 'react';
import {Grid, Typography, Button} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import {useParams} from "react-router-dom";
import { fetchModel } from '../../lib/fetchModelData';
import { path } from '../../path';

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
      const fetchUser = async () => {
          try {
              const userData =  await fetchModel(`${path}user/${userId}`)
              
              setUser(userData);
          } catch (error) {
              console.error('Error fetching user:', error);
          }
      };

      fetchUser();
  }, [userId]);
  return (
    <Grid container>
        <Grid item xs={12}>
            <Typography color="textSecondary">Name:</Typography>
            <Typography variant="h6" gutterBottom>
                {user && `${user.first_name} ${user.last_name}`}
            </Typography>
            <Typography color="textSecondary">Description:</Typography>
            <Typography variant="h6" gutterBottom>
                {user && `${user.description}`}
            </Typography>
            <Typography color="textSecondary">Location:</Typography>
            <Typography variant="h6" gutterBottom>
                {user && `${user.location}`}
            </Typography>
            <Typography color="textSecondary">Occupation:</Typography>
            <Typography variant="h6" gutterBottom>
                {user && `${user.occupation}`}
            </Typography>
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={4}>
            <Button
                size="large"
                to={user && `/photos/${user._id}`}
                component={Link}
                variant="contained"
                color="primary"
            >
                See Photos
            </Button>
        </Grid>
        <Grid item xs={4} />
    </Grid>
);
}

export default UserDetail;