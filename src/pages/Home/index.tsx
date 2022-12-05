import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSessionHandler, useSignInTrainerData } from "../../hooks";

import { Loading, Error, NavBar, TrainersGym } from "../../components";

import "./index.css";

export default function Home() {
    const navigate = useNavigate();
    const authentication = useSessionHandler();
    const signedInTrainerData = useSignInTrainerData(authentication.token!);

    if (authentication.loading) return <Loading />;

    if (authentication.error) {
        if (
            authentication.error[0].message === "jwt malformed"
            || 
            authentication.error[0].extensions.code === "BAD_USER_INPUT"
            || 
            authentication.error[0].message === "jwt expired"
        ) return <Navigate to="/createAccount" replace={true} />
        else if (
            authentication.error[0].message === "jwt expired"
            ||
            authentication.error[0].message === "User does not exist."
        ) return <Navigate to="/logIn" replace={true} />
        else return <Error {...authentication.error[0]} reload={true}/>;
    }

    if (signedInTrainerData.loading) return <Loading />;

    if (signedInTrainerData.error) return <Error {...signedInTrainerData.error[0]} reload={true}/>;

    return (
        <div className="Home">
            <NavBar token={authentication.token!}/>
            
            <div>
                <div className="EditProfilePicture" style={{ backgroundImage: `url(${signedInTrainerData.data!.profilePicture})` }}>
                    <button className="EditProfilePictureButton" type="button">Upload New Profile Picture</button>
                    <input type="file" accept=".png, .jpeg, .jpg, .svg" name="image" style={{ display: "none" }} title="image-select"/>
                </div>

                <div className="EditProfile">

                    <div className="EditProfileTitle">Edit Profile:</div>

                    <div className="EditProfileButtons">
                        <button className="EditProfileButton" type="button">Save Changes</button>
                        <button className="EditProfileButton" type="button">Change Password</button>
                        <button className="EditProfileButton" type="button">Add New Gym</button>
                        <button className="EditProfileButton" type="button" onClick={ () => {
                            localStorage.removeItem("token");
                            navigate("/logIn");
                        }}>Log Out</button>
                    </div>

                    <div className="EditProfileInputJoin">
                        <div className="EditProfileInput">
                            <label className="EditProfileInputTitle" htmlFor="name">Name</label>
                            <input className="EditProfileInputField" type="text" title="name" defaultValue={signedInTrainerData.data?.name} />
                        </div>

                        <div className="EditProfileInput">
                            <label className="EditProfileInputTitle" htmlFor="email">Email Address</label>
                            <input className="EditProfileInputField" type="email" title="email" defaultValue={signedInTrainerData.data?.email} />
                        </div>
                    </div>

                    <div className="EditProfileBio">
                        <label className="EditProfileInputTitle" htmlFor="bio">Bio</label>
                        <input className="EditProfileInputBio" type="text" title="bio" defaultValue={signedInTrainerData.data?.bio}/>
                    </div>
                </div>

                <div className="EditProfile">
                    <div className="EditProfileTitle">GYMS</div>

                    <div className="EditProfileGyms">
                        {
                            signedInTrainerData.data!.gyms!.map( ( gym ) => {
                                return <TrainersGym {...gym} trainerToken={authentication.token!}/>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
