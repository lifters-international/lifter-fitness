import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useSessionHandler, useEditTrainersVideo } from "../../hooks";

import { Loading, Error, NavBar, Notice, PreviewVideo } from "../../components";

import { BiLike, BiDislike } from "react-icons/bi";
import { IoMdShareAlt } from "react-icons/io";
import { BiPencil } from "react-icons/bi";
import { SiGoogleanalytics } from "react-icons/si";
import { AiOutlineMessage, AiOutlineDownload } from "react-icons/ai";

import { EditVideoDetails } from "./EditDetails";

import "./index.css";

export default function EditVideo() {
    const navigate = useNavigate();

    const authentication = useSessionHandler();

    let { videoId } = useParams();

    const editVideo = useEditTrainersVideo(authentication.token!, videoId as string);

    const [show, setShow] = useState('details');

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

    if (!editVideo.videoExists) return <Notice message="Video Does Not Exist" onClose={() => navigate("/videos")} />;

    if (editVideo.error !== null) return <Error message={editVideo.error as string} reload={true} />;

    return (
        <div className="EditVideoPage">
            <NavBar token={authentication.token!} />

            <div>
                <div className="VideoDetailsContainer">
                    <PreviewVideo thumbnailImage={editVideo.videoDetails?.thumbnail as string} videoUrl={editVideo.videoDetails?.url as string} />
                    <div className="vidDetails">
                        <div className="title">{editVideo.videoDetails?.title}</div>

                        <div className="dets">
                            <div>
                                <img src={editVideo.videoDetails?.trainer.profilePicture} alt="profile" />
                                <div>{editVideo.videoDetails?.trainer.name}</div>
                            </div>

                            <div className="buttons">
                                <div className="likeDislike">
                                    <div className="holder like"> 
                                        <BiLike size={30} color="#FF3636" />
                                        <span>{editVideo.videoDetails?.likeCount}</span>
                                    </div>
                                    <div className="holder">
                                        <BiDislike size={30} color="#FF3636" />
                                        <span>{editVideo.videoDetails?.disLikeCount}</span>
                                    </div>
                                </div>

                                <div>
                                    <IoMdShareAlt size={30} color="#FF3636" />
                                </div>

                                <div>
                                    <AiOutlineDownload size={30} color="#FF3636" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="SlideShow">
                    <div className="tabs">
                        <div className={`tab${show === "details" ? " showing" : ""}`} title="details" onClick={() => setShow("details")}>
                            <BiPencil color="#FF3636" size={50} title="details" />
                        </div>
                        <div className={`tab${show === "analytics" ? " showing" : ""}`} title="analytics" onClick={() => setShow("analytics")}>
                            <SiGoogleanalytics color="#FF3636" size={50} title="anyalytics" />
                        </div>
                        <div className={`tab${show === "comments" ? " showing" : ""}`} title="comments" onClick={() => setShow("comments")}>
                            <AiOutlineMessage color="#FF3636" size={50} title="comments" />
                        </div>
                    </div>

                    <div className="content">
                        {
                            show === "details" ?
                                <EditVideoDetails {...editVideo.videoDetails!} token={authentication.token!}/> : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
