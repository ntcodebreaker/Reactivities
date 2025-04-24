import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, TabPane } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

function ProfileFollowings() {
  const { profileStore } = useStore();
  const { profile, followings, loadingFollowins, activeTab } = profileStore;

  return (
    <TabPane loading={loadingFollowins}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={activeTab === 3
              ? `People following ${profile?.displayName}`
              : `People ${profile?.displayName} is following`}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {followings.map(profile => (
              <ProfileCard key={profile.userName} profile={profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </TabPane>
  );
}

export default observer(ProfileFollowings);