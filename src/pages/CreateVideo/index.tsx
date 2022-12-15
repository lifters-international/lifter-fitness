import React, { useState } from "react";


import { Navigate, useNavigate } from "react-router-dom";

import { useSessionHandler } from "../../hooks";

import { Loading, Error, NavBar, LabelInputDiv, RegisterButton } from "../../components";

import { PreviewVideo } from "./VideoPreview";

import { FileUploader } from "react-drag-drop-files";

import "./index.css";
import { getServerUrl, fetchGraphQl } from "../../utils";
import { createTrainersVideo } from "../../graphQlQuieries";

export default function CreateVideo() {
    const navigate = useNavigate();

    const authentication = useSessionHandler();

    const [video, setVideo] = useState(null);
    
    const [ thumbnailImage, setThumbnailImage ] = useState(null);

    const [ formState, setFormState ] = useState<{
        title: string,
        description: string
    }>({
        title: "", 
        description: ""
    });

    const [ loading, setLoading ] = useState(false);

    const [ error, setError ] = useState<string|null>(null);

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

    if ( loading ) return <Loading />;
    
    if ( error ) return <Error message={error as string} reload={true} />;

    const handleVideoDrop = ( choosenFile: any ) => {
        setVideo(choosenFile);
    }

    const handleThumbnailImage = ( choosenFile : any ) => {
        setThumbnailImage(choosenFile);
    }

    const uploadFile = async ( file: any ) :  Promise<{ url: string }> => {
        const videoForm = new FormData();
        videoForm.append("video", file);
        videoForm.append("token", authentication.token!);

        const req = await fetch(getServerUrl() +"upload/trainer/newVideo", { 
            method: "POST",
            body: videoForm
        });

        let result = await req.json();

        return result;
    }

    return (
        <>
            <NavBar token={authentication.token!} />

            <div className="FormContainer CreateVideo">
                <h1>Create Video</h1>

                <PreviewVideo thumbnailImage={ thumbnailImage ? URL.createObjectURL( thumbnailImage as any ) : "/defaultPicture.png" } videoUrl={ video ? URL.createObjectURL( video as any ) : "your_video's_name.mp4" } />

                <LabelInputDiv>
                    <label htmlFor="imageDrop">Drag & Drop Your Video</label>
                    <FileUploader
                        handleChange={handleVideoDrop}
                        name="imageDrop"
                        types={["MOV", "MPEG-1", "MPEG-2", "MPEG4", "MP4", "MPG", "AVI", "WMV", "MPEGPS", "FLV", "3GPP", "WebM", "DNxHR", "ProRes", "CineForm", "HEVC"]}
                    />
                </LabelInputDiv>

                <LabelInputDiv>
                    <label htmlFor="thumbnailImageDrop">Drag & Drop Your thumbnail Image</label>
                    <FileUploader
                        handleChange={handleThumbnailImage}
                        name="thumbnailImageDrop"
                        types={["png", "jpeg", "jpg", "svg"]}
                    />
                </LabelInputDiv>

                <LabelInputDiv>
                    <label htmlFor="title">Title</label>
                    <input placeholder="Video's Title" type="text" name="title" onChange={ 
                        (e) => {
                            setFormState({
                                ...formState,
                                title: e.target.value
                            })
                        }
                    }/>
                </LabelInputDiv>

                <LabelInputDiv>
                    <label htmlFor="desc">Description</label>
                    <input placeholder="Video's Description" type="text" name="desc"  onChange={ 
                        (e) => {
                            setFormState({
                                ...formState,
                                description: e.target.value
                            })
                        }
                    }/>
                </LabelInputDiv>

                <RegisterButton title="Create Video" onClick={ async () => {
                    if ( !video ) return setError("Please upload a video file to continue.");

                    let thumbNailUrl: string | undefined = undefined;
                    let videoUrl = "";

                    setLoading(true);

                    if ( formState.description.length <= 0 || formState.title.length <= 0 ) {
                        setLoading(false);
                        return setError("Please fill out form.")
                    }

                    let VideoResult = await uploadFile(video);

                    if ( !VideoResult.url ) {
                        setLoading(false);
                        return setError("Problem uploading video.")
                    };

                    videoUrl = VideoResult.url;

                    if ( thumbnailImage ) {
                        let thumbNailResult = await uploadFile(thumbnailImage);

                        if (!thumbNailResult.url) {
                            setLoading(false);
                            return setError("Problem uploading video.")
                        };

                        thumbNailUrl = thumbNailResult.url;
                    }

                    const req =  await fetchGraphQl(createTrainersVideo, {
                        token: authentication.token!,
                        input: {
                            ...formState,
                            url: videoUrl,
                            thumbnail: thumbNailUrl
                        }
                    });

                    setLoading(false);

                    if ( req.errors ) {
                        return setError(req.errors[0].message)
                    }

                    navigate(`video/${req.data.createTrainersVideo.id}/edit`)

                } } />
            </div>
        </>
    )
}
