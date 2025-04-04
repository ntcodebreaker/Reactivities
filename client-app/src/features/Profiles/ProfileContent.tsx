import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import ProfileAbout from "./ProfileAbout";

interface Props {
  profile: Profile;
}

function ProfileContent({ profile }: Props) {
  const panes = [
    { menuItem: "About", render: () => <ProfileAbout/> },
    { menuItem: "Photos", render: () => <ProfilePhotos profile={profile}/> },
    { menuItem: "Events", render: () => <TabPane>Events Content</TabPane> },
    { menuItem: "Followers", render: () => <TabPane>Followers Content</TabPane> },
    { menuItem: "Following", render: () => <TabPane>Following Content</TabPane> }
  ];
  
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      />
  );
}

export default observer(ProfileContent);