import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Loading, Error, AlertPrompt, AlertPromptProps, LabelInputDiv, RegisterButton, CheckBox } from "../../components";

import { FileUploader } from "react-drag-drop-files";

import { getServerUrl, fetchGraphQl, TrainerVideoInputInformtion } from "../../utils";

import { deleteTrainersVideo, updateTrainersVideo } from "../../graphQlQuieries";

type Props = {
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

export const EditVideoDetails: React.FC<Props> = ({ token, thumbnail, title, description, isPublic, clientOnly, allowLikes, allowDislikes, allowComments }) => {
    const navigate = useNavigate();

    let { videoId } = useParams();

    const [thumbnailImage, setThumbnailImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [formState, setFormState] = useState<TrainerVideoInputInformtion>();

    useEffect(() => {
        console.log(formState);
    }, [formState])

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
                    setFormState(prev => {
                        return {
                            ...prev,
                            thumbnail: res.url
                        }
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
                    console.log(  { updateTrainersVideoId: videoId, token, input: formState }  );
                    setLoading(true);
                    let req = await fetchGraphQl(updateTrainersVideo, { updateTrainersVideoId: videoId, token, input: formState || {} });
                    setLoading(false);
                    if ( req.errors) {
                        console.log( req.errors)
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
                        setFormState(prev => {
                            return {
                                ...prev,
                                title: e.target.value
                            }
                        })
                    }
                } />
            </LabelInputDiv>

            <LabelInputDiv>
                <label htmlFor="desc">Description</label>
                <input placeholder="Video's Description" type="text" name="desc" defaultValue={description} onChange={
                    (e) => {
                        setFormState(prev => {
                            return {
                                ...prev,
                                description: e.target.value
                            }
                        })
                    }
                } />
            </LabelInputDiv>

            <CheckBox
                checked={isPublic}
                label="Video is public"
                des="Public video allows the video to be watched. Private Videos can not be access by anyone but the creator."
                onChange={( val ) => {
                    setFormState(prev => {
                        return {
                           ...prev,
                           isPublic: val
                        }
                    })
                }}
            />

            <CheckBox
                checked={clientOnly}
                label="Is Video For Clients Only"
                des="No one other than your clients will be allowed to see video. The video will still need to be public."
                onChange={( val ) => {
                    setFormState(prev => {
                        return {
                           ...prev,
                           clientOnly: val
                        }
                    })
                }}
            />

            <CheckBox
                checked={allowLikes}
                label="Allow Likes"
                des="Whether or not people can like the video"
                onChange={( val ) => {
                    setFormState(prev => {
                        return {
                           ...prev,
                           allowLikes: val
                        }
                    })
                }}
            />

            <CheckBox
                checked={allowDislikes}
                label="Allow DisLikes"
                des="Whether or not people can dislike the video"
                onChange={( val ) => {
                    setFormState(prev => {
                        return {
                           ...prev,
                           allowDislikes: val
                        }
                    })
                }}
            />

            <CheckBox
                checked={allowComments}
                label="Allow Comments"
                des="Whether or not people can comment on the video"
                onChange={( val ) => {
                    setFormState(prev => {
                        return {
                           ...prev,
                           allowComments: val
                        }
                    })
                }}
            />

        </div>
    )
}
