// TopBar.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const TopBar = ({ auth, setAuth }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [context, setContext] = useState('');

  useEffect(() => {
    // Extract userId from the pathname
    let userId;
    if (pathname.includes("/user")) {
      userId = pathname.split("/").pop();
    } else if (pathname.includes("/photos")) {
      userId = pathname.split("/")[2];
    }

    // Fetch user details from the server
    if (userId) {
      const fetchUserData = async () => {
        const response = await fetch(`http://localhost:8081/api/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setContext(pathname.includes("/photos") ? `Photos of ${data.first_name} ${data.last_name}` : `Details of ${data.first_name} ${data.last_name}`);
        }
      };
      fetchUserData();
    }
  }, [pathname]);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Update auth state to logged out
    setAuth({ loggedIn: false, user: null });
    // Redirect to login page
    navigate("/login");
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
          Hoang Viet Trung - B21DCCN729 - {context}
        </Typography>
        {auth.loggedIn && user && (
          <>
            <Button color="inherit" component={Link} to={`/profile/${auth.user._id}`}>
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
