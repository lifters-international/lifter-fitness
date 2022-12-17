import React from 'react';

import { useNavigate } from 'react-router-dom';

import { GetAllTrainersVideo } from "../../utils";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export const Video: React.FC<GetAllTrainersVideo> = ({ id, thumbnail, title, description, isPublic, clientOnly, updatedAt, viewHistory, comments, likes, disLikes }) => {
    const navigate = useNavigate();
    
    return (
        <div className="video" onClick={ () => navigate(`/video/${id}/edit`)}>
            <div className="video-desc">
                <img src={thumbnail} alt="videoThumbnail" className="thumbnail" />

                <div className="vid-t-d">
                    <div className="title">{title}</div>
                    <div className="desc">{description}</div>
                </div>
            </div>

            <div>
                {
                    isPublic ? (
                        <>
                            <AiFillEye color="#FF3636" size={20} /> Public
                        </>
                    ) : (
                        <>
                            <AiFillEyeInvisible color="#FF3636" size={20} /> Private
                        </>
                    )
                }
            </div>

            <div>
                {
                    clientOnly ? <>Client Only</> : <>None</>
                }
            </div>

            <div>
                {new Date(updatedAt).toDateString()}    
            </div>

            <div>
                { viewHistory.length }
            </div>

            <div>
                { comments.length }
            </div>
            <div>
                { 
                    `${isNaN( ( ( likes.length + disLikes.length ) / likes.length ) * 100 ) ? "-" : `${ ( ( likes.length + disLikes.length ) / likes.length ) * 100 }%`} `
                }
            </div>
        </div>
    )
}
