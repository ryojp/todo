import { Container, List } from "@mui/material";
import { FC, useContext } from "react";
import AuthContext from "../../contexts/auth-context";
import UserProfileItem from "./UserProfileItem";

const EditUserProfile: FC = () => {
  const authCtx = useContext(AuthContext);
  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <List>
        <UserProfileItem target="username" username={authCtx.username} />
        <UserProfileItem target="password" password={"current password"} />
      </List>
    </Container>
  );
};

export default EditUserProfile;
