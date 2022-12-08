import { Container, List, ListItem } from "@mui/material";
import { FC, useContext } from "react";
import AuthContext from "../../contexts/auth-context";
import UserProfileItem from "./UserProfileItem";

const EditUserProfile: FC = () => {
  const authCtx = useContext(AuthContext);

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <List>
        <ListItem sx={{ justifyContent: "center" }}>
          <UserProfileItem
            target="username"
            username={authCtx.username}
            default={authCtx.username}
          />
        </ListItem>
        <ListItem sx={{ justifyContent: "center" }}>
          <UserProfileItem target="password" password={"***"} />
        </ListItem>
      </List>
    </Container>
  );
};

export default EditUserProfile;
