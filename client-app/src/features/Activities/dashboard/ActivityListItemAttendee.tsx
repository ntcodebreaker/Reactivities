import { observer } from "mobx-react-lite";
import { Image, List, Popup, PopupContent } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../Profiles/ProfileCard";

interface Props {
  attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {
  const styles = {
    borderColor: "orange",
    borderWidth: 3
  }
  return (
    <List horizontal>
      {attendees.map(attendee => (
        <Popup hoverable key={attendee.userName}
          trigger={
            <List.Item key={attendee.userName} as={Link} to={`/profiles/${attendee.userName}`}>
              <Image
                size="mini"
                circular src={attendee.image || '/assets/user.png'}
                bordered
                style={attendee.following ? styles : null}
              />
            </List.Item>
          }>
          <PopupContent>
            <ProfileCard profile={attendee} />
          </PopupContent>
        </Popup>
      ))};
    </List>
  )
})
