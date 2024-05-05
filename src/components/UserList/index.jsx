import * as React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";
import "./styles.css";
import { fetchModel } from "../../lib/fetchModelData";
import { path } from "../../path";

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
    };
  }

  componentDidMount = async ()=> {
      const users = await fetchModel(`${path}user/list`)
      // const users = await fetchModel(`https://zx8fxt-8081.csb.app/api/user/list`)
    this.setState({ users });
  }
  render() {
    let userList; 
    if (this.state.users) {
      userList = (
        this.state.users.map((user) => (
          <ListItem to={`/users/${user._id}`} component={Link} key={user._id} divider >
            <ListItemText primary={user.first_name + " " + user.last_name} />
          </ListItem>
        )));
    } else {
      userList = <ListItem>Loading...</ListItem>;
    }

    return (
      <List component="nav">
        { userList }
      </List>
    );
  }

}

export default UserList;