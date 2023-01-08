import { Navigate, useNavigate } from "react-router-dom";

import { useSessionHandler, useGetAllTrainersVideos } from "../../hooks";

import { Loading, Error, NavBar, SearchBar } from "../../components";

import { MdOutlineSlowMotionVideo } from "react-icons/md";

import "./index.css";
import { Video } from "./Video";

export default function Videos() {
    const navigate = useNavigate();

    const authentication = useSessionHandler();

    const trainersVideo =  useGetAllTrainersVideos( authentication.token! );

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

    if ( trainersVideo.loading ) return <Loading />

    if ( trainersVideo.error ) return <Error message="Error loading videos" reload={true} />

    return (
        <div className="VideosPage">
            <NavBar token={authentication.token!} />

            <div className="container">
                <div className="header">
                    <SearchBar 
                        onChange={(event) => {
                            console.log(event.target.value)
                        }}

                        placeholder="Search For Your Videos"
                        showIcon={false}
                        className="videoSearchView"
                        searchInputClass="videoSearchView_input"
                    />

                    <MdOutlineSlowMotionVideo size={60} color="#FF3636" className="createVideo" onClick={ () => navigate("/createVideo") } />
                </div>

                <div className="content">
                    <div className="titleBars">
                        <div>Video</div>
                        <div>Visibility</div>
                        <div>Restriction</div>
                        <div>Date</div>
                        <div>Views</div>
                        <div>Comments</div>
                        <div>Likes (vs. dislikes) </div>
                    </div>

                    <div className="videos">
                        {
                            trainersVideo.data.map( ( vid, index ) => {
                                return <Video {...vid} key={index} />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
