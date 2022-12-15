import React, { useState, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useSessionHandler, useEditTrainersVideo } from "../../hooks";

import { Loading, Error, NavBar, SearchBar, TrainersGym, Modal, NotifyStateManager, NotifyStateManagerType, Notify, Notice, PreviewVideo } from "../../components";

import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { BiPencil } from "react-icons/bi";
import { SiGoogleanalytics } from "react-icons/si";
import { AiOutlineMessage } from "react-icons/ai";

import "./index.css";

export default function EditVideo() {
    const navigate = useNavigate();

    const authentication = useSessionHandler();

    let { videoId } = useParams();

    const editVideo = useEditTrainersVideo( authentication.token!, videoId as string );

    const [ show, setShow ] = useState('details');

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
            authentication.error[0].message === "Trainer does not exist."
        ) return <Navigate to="/logIn" replace={true} />
        else return <Error {...authentication.error[0]} reload={true} />;
    }

    if ( !editVideo.videoExists ) return <Notice message="Video Does Not Exist" onClose={ () => navigate("/videos") } />;

    if ( editVideo.error !== null ) return <Error message={editVideo.error as string} reload={true} />;

    return (
        <div className="EditVideoPage">
            <NavBar token={authentication.token!} />

            <div>
                <PreviewVideo thumbnailImage={ editVideo.videoDetails?.thumbnail as string } videoUrl={editVideo.videoDetails?.url as string } />

                <div className="SlideShow">
                    <div className="tabs">
                        <div className={`tab${show === "details" ? " showing": "" }`} title="details" onClick={ () => setShow("details")}>
                            <BiPencil color="#FF3636" size={50} title="details" />
                        </div>
                        <div className={`tab${show === "analytics" ? " showing": "" }`} title="analytics"  onClick={ () => setShow("analytics")}>
                            <SiGoogleanalytics color="#FF3636" size={50} title="anyalytics" />
                        </div>
                        <div className={`tab${show === "comments" ? " showing": "" }`} title="comments"  onClick={ () => setShow("comments")}>
                            <AiOutlineMessage color="#FF3636" size={50} title="comments" />
                        </div>
                    </div>

                    <div className="content">
                    </div>
                </div>
            </div>
        </div>
    )
}
