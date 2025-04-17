import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";

function ProfilePage() {
  const { username } = useParams();
  const { profileStore } = useStore();
  const { loadingProfile, loadProfile, profile, setActiveTab } = profileStore;

  useEffect(() => {
    if (username) {
      loadProfile(username);
    }

    return () => { setActiveTab(0) };
  }, [loadProfile, username]);

  if (loadingProfile) return <LoadingComponent content='Loading profile...' />

  return (
    <Grid>
      <Grid.Column width={16}>
        <h1>Profile</h1>
        {profile &&
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        }

      </Grid.Column>
    </Grid>
  );
}

export default observer(ProfilePage);