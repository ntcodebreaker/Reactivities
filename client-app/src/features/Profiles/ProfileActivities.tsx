import { Card, CardGroup, Grid, GridColumn, Header, Image, Tab, TabPane, TabProps } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";
import { SyntheticEvent, useEffect } from "react";

function ProfileActivities() {
  const { profileStore } = useStore();
  const {
    profile,
    userActivities,
    loadUserActivities,
    loadingActivities } = profileStore

  const panes = [
    { menuItem: "Future Events", pane: { key: "future" } },
    { menuItem: "Past Events", pane: { key: "past" } },
    { menuItem: "Hosting", pane: { key: "hosting" } }
  ];

  useEffect(() => {
    if (profile) {
      loadUserActivities(profile.userName);
    }
  }, [loadUserActivities, profile]);

  function handleTabChange(e: SyntheticEvent, data: TabProps) {
    loadUserActivities(profile!.userName,
      panes[data.activeIndex as number].pane.key);
  }

  return (
    <TabPane loading={loadingActivities}>
      <Grid>
        <GridColumn width={16}>
          <Header
            floated="left"
            icon="calendar"
            content="Activities"
          />
        </GridColumn>
        <GridColumn width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => { handleTabChange(e, data) }}
          />
          <br/>
          <CardGroup itemsPerRow={4}>
            {userActivities.map(activity => (
              <Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
                <Card.Content>
                  <Card.Header textAlign="center">
                    {activity.title}
                  </Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(new Date(activity.date), 'do LLL')}</div>
                    <div>{format(new Date(activity.date), 'h:mm a')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </CardGroup>
        </GridColumn>
      </Grid>
    </TabPane>
  );
}

export default observer(ProfileActivities);