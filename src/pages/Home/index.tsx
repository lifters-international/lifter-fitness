import React, { useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSessionHandler, useSignInTrainerData } from "../../hooks";

import { Loading, Error, NavBar, TrainersGym, Modal, NotifyStateManager, NotifyStateManagerType, Notify } from "../../components";

import "./index.css";
import { useSaveTrainerProfileChanges } from "../../hooks/useSaveTrainerProfileChanges";
import { fetchGraphQl, getImageUploadApi, TrainerInformationToSave } from "../../utils";
import { updateTrainerPassword, addNewTrainersGym } from "../../graphQlQuieries";

export default function Home() {
    const navigate = useNavigate();
    const authentication = useSessionHandler();
    const signedInTrainerData = useSignInTrainerData(authentication.token!);
    const saveUserData = useSaveTrainerProfileChanges();
    const [trainerData, setTrainerData] = useState<TrainerInformationToSave>();

    const imageInputRef = useRef<HTMLInputElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const [ notify, setNotify ] = useState<NotifyStateManager>({ show: false, message: "", type: "success" });

    const [ passwords, setPasswords ] = useState<{
        oldPassword: string;
        newPassword: string;
    }>({ oldPassword: "", newPassword: "" });

    const [ showPassword, setShowPassword ] = useState(false);


    const [ location, setLocation ] = useState("");

    const [ showLocation, setShowLocation ] = useState(false);

    const handleShowLocation = () => setShowLocation(true);

    const handleShowLocationCancel = () => {
        setShowLocation(false);
        setLocation('');
    }

    const handleShowLocationSave = () => {
        fetchGraphQl(addNewTrainersGym, { token: authentication.token!, location })
        .then( res => {

            let type: NotifyStateManagerType = "success";

            let message = "";

            if ( res.data ) navigate(0);

            else {
                type = "error";
                message = "An error occured while add new gym location.";
            }

            setNotify({ show: true, message, type });
            setShowLocation(false);
        })
    }


    const handleChangePasswordShow = () => {
        setShowPassword(true);
    }

    const handleChangePasswordCancel = () => {
        setShowPassword(false);
    }

    const handleChangePasswordOk = () => {
        fetchGraphQl(updateTrainerPassword, { 
            token: authentication.token!,
            ...passwords
        })
           .then(res => {
                
            let type: NotifyStateManagerType = "success";

            let message = "";

            if ( res.data ) message = "Your password has been updated successfully";

            else {
                type = "error";
                message = "An error occurred while updating your password, please try again.";
            }

            setNotify({ type, show: true, message });
            setShowPassword(false);
           });
    }

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

                let type: NotifyStateManagerType = "success";

                let message = "";

                if ( result.error ) {
                    type = "error";
                    message = "There was a problem uploading a new profile image please try again later.";
                }

                if ( result.url ) message = "Your profile image has been updated successfully.";

                setNotify({ type, show: true, message });

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
                        <button className="EditProfileButton" type="button" onClick={handleChangePasswordShow} >Change Password</button>
                        <button className="EditProfileButton" type="button" onClick={handleShowLocation}>Add New Gym</button>
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
                            signedInTrainerData.data!.gyms!.map((gym, index) => {
                                return <TrainersGym {...gym} trainerToken={authentication.token!} key={`trainers-gym-${index}`}/>
                            })
                        }
                    </div>
                </div>
            </div>

            <Modal title="Change Password" visible={showPassword} onOk={ handleChangePasswordOk } onCancel={ handleChangePasswordCancel } >
                <div className="EditProfileInputJoin ChangePasswordModal">
                    <div className="EditProfileInput">
                        <label className="EditProfileInputTitle" htmlFor="cPassword">Current Password</label>
                        <input className="EditProfileInputField" type="password" title="cPassword" placeholder="Current Password" 
                            onChange={
                                (e) => {
                                    setPasswords({
                                       ...passwords,
                                        oldPassword: e.target.value
                                    });
                                }
                            }
                        />
                    </div>

                    <div className="EditProfileInput">
                        <label className="EditProfileInputTitle" htmlFor="nPassword">New Password</label>
                        <input className="EditProfileInputField" type="password" title="nPassword" placeholder="New Password" 
                            onChange={
                                (e) => {
                                    setPasswords({
                                       ...passwords,
                                        newPassword: e.target.value
                                    });
                                }
                            }
                        />
                    </div>
                </div>
            </Modal>

            <Modal title="Add New Gym Location" visible={showLocation} onOk={ handleShowLocationSave } onCancel={ handleShowLocationCancel } >
                <div className="EditProfileInput ChangePasswordModal">
                    <label className="EditProfileInputTitle" htmlFor="location">New Location</label>
                    <input className="EditProfileInputField" type="text" title="location" placeholder="New Location"

                        onChange={
                            (e) => {
                                setLocation(e.target.value);
                            }
                        }
                    />
                </div>

            </Modal>

            <Notify 
                {...notify}
                hideNotify={ () => setNotify({...notify, show: false }) }
            />
        </div>
    )
}
