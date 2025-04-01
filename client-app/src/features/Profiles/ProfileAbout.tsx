import { Button, Grid, GridColumn, Header, TabPane } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import { observer } from "mobx-react-lite";

function ProfileAbout() {
  const { profileStore: { isCurrentUser, profile } } = useStore();
  const [editMode, setEditMode] = useState(false);

  return (
    <TabPane>
      <Grid>
        <GridColumn width={16}>
          <Header floated="left" icon="image" content={`About ${profile?.displayName}`} />
          {isCurrentUser &&
            <Button floated="right" basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          }
        </GridColumn>
        <GridColumn width={16}>
          {/* show the form if editing the profile 
          otherwhise show the read-only bio */}
          {editMode
            ? <ProfileEditForm setEditMode={setEditMode} />
            : <span style={{ whiteSpace: "pre-wrap" }}>{profile?.bio}</span>}
        </GridColumn>
      </Grid>
    </TabPane>
  );
}

export default observer(ProfileAbout);
