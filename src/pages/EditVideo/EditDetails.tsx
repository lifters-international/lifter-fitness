import React, { useState } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import { Loading, Error, NavBar, LabelInputDiv, RegisterButton, PreviewVideo } from "../../components";

import { FileUploader } from "react-drag-drop-files";

import { getServerUrl, fetchGraphQl, TrainerVideoInputInformtion } from "../../utils";

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
    price: number;
}

export const EditVideoDetails: React.FC<Props> = ({ token, thumbnail, title, description, price, isPublic, clientOnly, allowLikes, allowDislikes }) => {
    const navigate = useNavigate();

    const [thumbnailImage, setThumbnailImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [formState, setFormState] = useState<TrainerVideoInputInformtion>();

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
                <label htmlFor="price-cost">Cost Of Video For Non-Clients</label>
                <input placeholder="Video's Cost" type="number" name="price-cost" defaultValue={price} min={0} onChange={
                    (e) => {
                        setFormState({
                            ...formState,
                            price: Number(e.target.value)
                        })
                    }
                } />
            </LabelInputDiv>

            <LabelInputDiv>
                <div>
                    <label htmlFor="publicVideo">Video is public</label>
                    <input
                        type="checkbox"
                        name="yesPublic"
                        placeholder="Yes it is public"
                        checked={isPublic}
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
                        checked={clientOnly}
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
                        checked={allowLikes}
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
                        checked={allowDislikes}
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

            <RegisterButton title="Save Video Settings" onClick={() => {} } />
        </div>
    )
}
