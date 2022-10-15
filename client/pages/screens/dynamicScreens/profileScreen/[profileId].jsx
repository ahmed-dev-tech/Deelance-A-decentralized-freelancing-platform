import React from "react";
import { useRouter } from "next/router";

function ProfilePage(props) {
  const router = useRouter();
  const { profileId } = router.query;
  return <div>{profileId}</div>;
}

export default ProfilePage;
