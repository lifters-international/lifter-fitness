import React, { useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSessionHandler, useSignInTrainerData } from "../../hooks";

import { Loading, Error, NavBar, TrainersGym } from "../../components";

import "./index.css";
import { useSaveTrainerProfileChanges } from "../../hooks/useSaveTrainerProfileChanges";
import { getImageUploadApi, TrainerInformationToSave } from "../../utils";

export default function Home() {
    const navigate = useNavigate();
    const authentication = useSessionHandler();
    const signedInTrainerData = useSignInTrainerData(authentication.token!);
    const saveUserData = useSaveTrainerProfileChanges();
    const [trainerData, setTrainerData] = useState<TrainerInformationToSave>();

    const imageInputRef = useRef<HTMLInputElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const saveProfileImage = async ( newImage: string ) => {
        await saveUserData.saveAsync({
            token: authentication.token!,
            trainerInfor: {
                profilePicture: newImage
            }
        })
    }

    const handleInputImageChange = async () => {
        if ( imageInputRef.current ) {
            const form = new FormData();
            const image = imageInputRef.current.files![0];

            if ( image ) {
                form.append("image", image);
                form.append("token", authentication.token!);

                const req = await fetch(getImageUploadApi(), {
                    method: "POST",
                    body: form
                });

                let result =  await req.json();


                if ( imageContainerRef.current && result.url ) {
                    imageContainerRef.current.style.backgroundImage = `url(${result.url})`;
                    saveProfileImage(result.url);
                }
            }
        }
    }

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
        else return <Error {...authentication.error[0]} reload={true} />;
    }

    if (signedInTrainerData.loading) return <Loading />;

    if (signedInTrainerData.error) return <Error {...signedInTrainerData.error[0]} reload={true} />;

    return (
        <div className="Home">
            <NavBar token={authentication.token!} />

            <div>
                <div className="EditProfilePicture" style={{ backgroundImage: `url(${signedInTrainerData.data!.profilePicture})` }} ref={imageContainerRef}>
                    <button className="EditProfilePictureButton" type="button" onClick={ () => imageInputRef.current?.click() } >Upload New Profile Picture</button>
                    <input type="file" accept=".png, .jpeg, .jpg, .svg" name="image" style={{ display: "none" }} title="image-select" ref={imageInputRef} onChange={handleInputImageChange} />
                </div>

                <div className="EditProfile">

                    <div className="EditProfileTitle">Edit Profile:</div>

                    <div className="EditProfileButtons">
                        <button className="EditProfileButton"
                            type="button"
                            onClick={
                                () => {
                                    saveUserData.save({
                                        token: authentication.token!,
                                        trainerInfor: trainerData || {}
                                    })
                                }
                            }
                        >
                            {
                                saveUserData.isSaving ? "Saving..." : saveUserData.saveSuccessfully ? "Saved Succesfully" : "Save Changes"
                            }
                        </button>
                        <button className="EditProfileButton" type="button">Change Password</button>
                        <button className="EditProfileButton" type="button">Add New Gym</button>
                        <button className="EditProfileButton" type="button" onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/logIn");
                        }}>Log Out</button>
                    </div>

                    <div className="EditProfileInputJoin">
                        <div className="EditProfileInput">
                            <label className="EditProfileInputTitle" htmlFor="name">Name</label>
                            <input className="EditProfileInputField" type="text" title="name" defaultValue={signedInTrainerData.data?.name}
                                onChange={(e) => {
                                    setTrainerData({
                                        ...trainerData,
                                        name: e.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="EditProfileInput">
                            <label className="EditProfileInputTitle" htmlFor="email">Email Address</label>
                            <input className="EditProfileInputField" type="email" title="email" defaultValue={signedInTrainerData.data?.email}
                                onChange={(e) => {
                                    setTrainerData({
                                        ...trainerData,
                                        email: e.target.value
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="EditProfileBio">
                        <label className="EditProfileInputTitle" htmlFor="bio">Bio</label>
                        <input className="EditProfileInputBio" type="text" title="bio" defaultValue={signedInTrainerData.data?.bio}
                            onChange={(e) => {
                                setTrainerData({
                                    ...trainerData,
                                    bio: e.target.value
                                });
                            }}
                        />
                    </div>
                </div>

                <div className="EditProfile">
                    <div className="EditProfileTitle">GYMS</div>

                    <div className="EditProfileGyms">
                        {
                            signedInTrainerData.data!.gyms!.map((gym) => {
                                return <TrainersGym {...gym} trainerToken={authentication.token!} />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
