import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";
import "./styles.css";
import { fetchModel } from "../../lib/fetchModelData";
import { path } from "../../path";

const UserList = ({ updateUsers }) => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await fetchModel(`${path}user/list`);
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, [updateUsers]);

  if (!users) {
    return <ListItem>Loading...</ListItem>;
  }

  return (
    <List component="nav">
      {users.map((user) => (
        <ListItem to={`/users/${user._id}`} component={Link} key={user._id} divider>
          <ListItemText primary={user.first_name + " " + user.last_name} />
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;