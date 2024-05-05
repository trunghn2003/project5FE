import React from 'react';
import { useLocation } from 'react-router-dom';
import models from '../../modelData/models';
import { AppBar, Toolbar, Typography } from "@mui/material";

const TopBar = () => {
  const { pathname } = useLocation();

  let context = '';
  if (pathname.includes('/user')) {
    const userId = pathname.split('/').pop();
    const user = models.userModel(userId);
    context = user ? `Details of ${user.first_name} ${user.last_name}` : '';
  } else if (pathname.includes('/photos')) {
    const userId = pathname.split('/')[2];
    const user = models.userModel(userId);
    context = user ? `Photos of ${user.first_name} ${user.last_name}` : '';
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          Hoang Viet Trung - B21DCCN729 - {context}:
        </Typography>

            
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
