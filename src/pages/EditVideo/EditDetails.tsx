import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Loading, Error, AlertPrompt, AlertPromptProps, LabelInputDiv, RegisterButton } from "../../components";

import { FileUploader } from "react-drag-drop-files";

import { getServerUrl, fetchGraphQl, TrainerVideoInputInformtion } from "../../utils";

import { deleteTrainersVideo, updateTrainersVideo } from "../../graphQlQuieries";

export type Props = {
    token: string
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    clientOnly: boolean;
    allowComments: boolean;
    allowLikes: boolean;
    allowDislikes: boolean;
    isPublic: boolean;
}

export const EditVideoDetails: React.FC<Props> = ({ token, thumbnail, title, description, isPublic, clientOnly, allowLikes, allowDislikes }) => {
    const navigate = useNavigate();

    let { videoId } = useParams();

    const [thumbnailImage, setThumbnailImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [formState, setFormState] = useState<TrainerVideoInputInformtion>();

    const [ alertState, setAlertState] = useState<AlertPromptProps>({
        show: false, 
        message: "",
        type: [],
        onOkay: ( answer?: string ) => {

        },

        onCancel: () => {
            setAlertState({ ...alertState, show: false })
        }
    });

    useEffect( () => {
        if ( thumbnailImage ) {
            setLoading(true)
            uploadFile(thumbnailImage)
            .then( res => {
                setLoading(false);
                
                if ( res.url ) {
                    setFormState({
                        ...formState,
                        thumbnail: res.url
                    });
                }else {
                    setError("There was a problem uploading the thumbnail.")
                }
            })
        }
    }, [ thumbnailImage ]);

    if (loading) return <Loading />;

    if (error) return <Error message={error as string} reload={true} />;

    const handleThumbnailImage = (choosenFile: any) => {
        setThumbnailImage(choosenFile);
    }

    const uploadFile = async (file: any): Promise<{ url: string }> => {
        const videoForm = new FormData();
        videoForm.append("video", file);
        videoForm.append("token", token);

        const req = await fetch(getServerUrl() + "upload/trainer/newVideo", {
            method: "POST",
            body: videoForm
        });

        let result = await req.json();

        return result;
    }

    return (
        <div className="FormContainer CreateVideo editVideoDetails">
            <AlertPrompt {...alertState} />

            <div className="editVidButtons">

                <RegisterButton title="Save Video Settings" onClick={ async () => {
                    setLoading(true);
                    let req = await fetchGraphQl(updateTrainersVideo, { updateTrainersVideoId: videoId, token, input: formState });
                    setLoading(false);
                    if ( req.errors ) {
                        setAlertState( prev => {
                            return {
                                ...prev,
                                show: true,
                                message: "There was an error while saving this video", 
                                type: [ "Ok" ],
                                onOkay: () => {}
                            }
                        })
                    }else {
                        if ( req.data.updateTrainersVideo.type === "successful" ) {
                            setAlertState( prev => {
                                return {
                                    ...prev,
                                    show: true, 
                                    message: "Video updated successfully",
                                    type: [ "Ok" ],
                                    onCancel: () => {
                                        navigate(0);
                                    }
                                }
                            })
                        }
                    }
                } } />

                <RegisterButton title="Delete Video" onClick={() => {
                    setAlertState({
                        ...alertState,
                        show: true,
                        message: "Are you sure you would like to delete this video?",
                        type: [ "Ok", "Cancel" ],
                        onOkay: async () => {
                            setLoading(true);
                            let req = await fetchGraphQl(deleteTrainersVideo, { deleteTrainersVideoId: videoId, token })
                            setLoading(true)
                            if ( req.errors ) {
                                setAlertState( prev => {
                                    return {
                                        ...prev,
                                        show: true,
                                        message: "There was an error while deleting the video.",
                                        type: [ "Ok" ],
                                        onOkay: () => {}
                                    }
                                })
                            }else {
                                if ( req.data.deleteTrainersVideo.type === "successful"  ) navigate("/videos")
                            }
                        }
                    })
                } } />
            </div>

            <h1>Edit Video</h1>

            <img src={formState?.thumbnail ? formState.thumbnail : thumbnail} alt="thumbnail" className="thumbnail" />

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
                <input placeholder="Video's Title" type="text" name="title" defaultValue={title} onChange={
                    (e) => {
                        setFormState({
                            ...formState,
                            title: e.target.value
                        })
                    }
                } />
            </LabelInputDiv>

            <LabelInputDiv>
                <label htmlFor="desc">Description</label>
                <input placeholder="Video's Description" type="text" name="desc" defaultValue={description} onChange={
                    (e) => {
                        setFormState({
                            ...formState,
                            description: e.target.value
                        })
                    }
                } />
            </LabelInputDiv>

            <LabelInputDiv>
                <div>
                    <label htmlFor="publicVideo">Video is public</label>
                    <input
                        type="checkbox"
                        name="publicVideo"
                        placeholder="Yes it is public"
                        defaultChecked={isPublic}
                        onChange={
                            (e) => {
                                setFormState({
                                    ...formState,
                                    isPublic: e.target.checked
                                })
                            }
                        }
                    />
                    <div>Public video allows the video to be watched. Private Videos can not be access by anyone but the creator.</div>
                </div>
            </LabelInputDiv>

            

            <LabelInputDiv>
                <div>
                    <label htmlFor="clientOnly">Is Video For Clients Only</label>
                    <input
                        type="checkbox"
                        name="clientOnly"
                        placeholder="Yes it is client only"
                        defaultChecked={clientOnly}
                        onChange={
                            (e) => {
                                setFormState({
                                    ...formState,
                                    clientOnly: e.target.checked
                                })
                            }
                        }
                    />

                    <div>No one other than your clients will be allowed to see video. The video will still need to be public.</div>
                </div>

            </LabelInputDiv>

            <LabelInputDiv>
                <div>
                    <label htmlFor="allowLikes">Allow Likes</label>
                    <input
                        type="checkbox"
                        name="allowLikes"
                        placeholder="Yes it is likeable"
                        defaultChecked={allowLikes}
                        onChange={
                            (e) => {
                                setFormState({
                                    ...formState,
                                    allowLikes: e.target.checked
                                })
                            }
                        }
                    />

                    <div>Whether or not people can like the video</div>
                </div>

            </LabelInputDiv>

            <LabelInputDiv>
                <div>
                    <label htmlFor="allowLikes">Allow DisLikes</label>
                    <input
                        type="checkbox"
                        name="allowdisLikes"
                        placeholder="Yes it is likeable"
                        defaultChecked={allowDislikes}
                        onChange={
                            (e) => {
                                setFormState({
                                    ...formState,
                                    allowDislikes: e.target.checked
                                })
                            }
                        }
                    />

                    <div>Whether or not people can dislike the video</div>
                </div>

            </LabelInputDiv>


        </div>
    )
}
