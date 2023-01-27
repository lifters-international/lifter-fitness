import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useSessionHandler, useGetTrainerDetails } from '../../hooks';

import { Error, Loading, NavBar } from "../../components";

import { TrainerHomeSlide } from "./TrainerHomeSlide";
import { TrainerRatingSlide } from "./TrainerRatingSlide";
import { TrainerWriteSlide } from "./TrainerWriteSlide";


import ReactStars from "react-rating-stars-component";

import { MdVerifiedUser } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { HiPencil } from "react-icons/hi";

import "./index.css";

const TrainersDetails: React.FC = () => {
    const authentication = useSessionHandler();
    const trainerDetails = useGetTrainerDetails(authentication.token!);
    const location = useLocation();
    let queryShow = new URLSearchParams(location.search).get("show");

    queryShow = ["home", "reviews", "write"].includes(queryShow || "" ) ? queryShow : "home";

    const [show, setShow] = useState(queryShow);

    if (authentication.loading) return <Loading />;

    if (authentication.error) {
        if (
            authentication.error[0].message === "jwt malformed"
            ||
            authentication.error[0].extensions.code === "BAD_USER_INPUT"
            ||
            authentication.error[0].message === "jwt expired"
            ||
            authentication.error[0].message === "Trainer does not exist."
        ) return <Navigate to="/createAccount" replace={true} />
        else if (authentication.error[0].message === "jwt expired") return <Navigate to="/logIn" replace={true} />
        else return <Error {...authentication.error[0]} reload={true} />;
    }

    if (trainerDetails.loading) return <Loading />;

    if (trainerDetails.error) return <Error message="Problem finding trainer, please try again later." reload={true}/>;

    return (
        <div className="TrainerDetailsPage">
            <NavBar token={authentication.token!} />

            <div className="TrianerDetails">
                <div className="bannerImage" style={{ backgroundImage: `url(${trainerDetails.data?.bannerImage})` }} />

                <div className="DetailsContainer">
                    <div className="dets">
                        <img className="trainerProfilePicture" src={trainerDetails.data?.profilePicture} alt={`${trainerDetails.data?.name} profile`} />
                        <div className="trainer-dets">
                            <div>
                                <div className="name-verification">
                                    <div className="trainerName">{trainerDetails.data?.name}</div>
                                    {
                                        trainerDetails.data?.onBoardCompleted ? 
                                        <MdVerifiedUser color="#FF3636" size={30} className="trainerVerified"/> : null
                                    }
                                </div>
                                <ReactStars
                                    name="react-stars"
                                    value={trainerDetails.data?.ratingsAverage!}
                                />
                            </div>
                            <div className="trainerBio">{trainerDetails.data?.bio}</div>
                            <div>{trainerDetails.data?.clientCount} Clients</div>
                        </div>
                    </div>

                </div>

                <div className="TrainersSlides">
                    <div className="tabs">
                        <div className={`tab${show === "home" ? " showing" : ""}`} onClick={() => setShow("home")}>
                            <AiFillHome color="#FF3636" size={40} title="home"/>
                        </div>
                        <div className={`tab${show === "reviews" ? " showing" : ""}`} onClick={() => setShow("reviews")}>
                            <BsStars color="#FF3636" size={40} title="Reviews"/>
                        </div>
                        <div className={`tab${show === "write" ? " showing" : ""}`} onClick={() => setShow("write")}>
                            <HiPencil color="#FF3636" size={40} title="Write A Review" />
                        </div>
                    </div>
                    <div className="slide">
                        { show === "home" && <TrainerHomeSlide gyms={trainerDetails.data?.gyms!} token={authentication.token!} /> }
                        { show === "reviews" && <TrainerRatingSlide ratings={trainerDetails.data?.ratings!} /> }
                        { show === "write" && <TrainerWriteSlide /> }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainersDetails;
