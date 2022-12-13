import React from "react";
import { Navigate, useParams } from "react-router-dom";

import { Error } from "../components";

const ProfilePreviewWithToken: React.FC = () => {
    let { token } = useParams();

    if (!token) return <Error message="No token provided" />;

    localStorage.setItem("token", token);

    return <Navigate to="/profile/preview" replace={true} />;
}

export default ProfilePreviewWithToken;
