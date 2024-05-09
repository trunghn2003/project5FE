// TopBar.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const TopBar = ({ auth, setAuth }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [context, setContext] = useState('');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const token = localStorage.getItem('token'); // Get token from localStorage
  useEffect(() => {

    // This will be triggered when the pathname changes.
    if (token && user) {
      let userId;
      if (pathname.includes("/user")) {
        userId = pathname.split("/").pop();
      } else if (pathname.includes("/photos")) {
        userId = pathname.split("/")[2];
      }
      // Fetch user details from the server using the ID from localStorage
      const fetchUserData = async () => {
        const response = await fetch(`http://localhost:8081/api/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        if (response.ok) {
          if(userId){

            const data = await response.json();
            // Update context based on the pathname and fetched data
            if (pathname.includes("/photos")) {
              setContext(`Photos of ${data.first_name} ${data.last_name}`);
            } else {
              setContext(`Details of ${data.first_name} ${data.last_name}`);
            }
          }
        } else {
          setContext('');
          if (response.status === 401) {
            // Handle unauthorized error, clear local storage and update state
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setAuth({ loggedIn: false, user: null });
            navigate("/login");
          }
        }
      };
      fetchUserData();
    }
  }, [pathname, navigate, setAuth, user, token]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from local storage
    localStorage.removeItem("user"); // Clear user data from local storage
    setAuth({ loggedIn: false, user: null }); // Update auth state
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
          Hoang Viet Trung - B21DCCN729 - {context}
        </Typography>
        {user && (
          <>
            <Button color="inherit" component={Link} to={`/profile/${user._id}`}>
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
