import { Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { Button } from "semantic-ui-react";
import * as Yup from "yup";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

interface Props {
  setEditMode: (editMode: boolean) => void;
}

function ProfileEditForm({ setEditMode }: Props) {
  const { profileStore: { profile, updateProfile } } = useStore();

  const validationSchema = Yup.object({
    displayName: Yup.string().required("Display name is a required field.")
  });

  return (
    <Formik
      initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
      validationSchema={validationSchema}
      onSubmit={values => updateProfile(values).then(() => setEditMode(false))}>
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="ui form">
          <MyTextInput name="displayName" placeholder="Display Name" />
          <MyTextArea rows={3} name="bio" placeholder="Add your bio" />
          <Button
            disabled={!dirty || !isValid}
            loading={isSubmitting} floated="right" positive
            type="submit" content="Update Profile" />
        </Form>
      )}
    </Formik>
  );
}

export default observer(ProfileEditForm);