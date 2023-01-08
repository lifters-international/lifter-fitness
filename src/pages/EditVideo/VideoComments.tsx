import React, { useState } from "react";

import { Loading, Error } from "../../components";

import { useGetTrainersVideoComments } from "../../hooks";
import { getDiff } from "../../utils";

type Props = {
    token: string;
    videoId: string;
}

export const VideoComments: React.FC<Props> = ({ token, videoId }) => {
    const { loading, error, comments, errorPostComment, postComment } = useGetTrainersVideoComments(token, videoId);
    const [showAll, setShowAll] = useState(false);
    const [ cState, setCState ] = useState("");

    if (loading) return <Loading />;

    if ( errorPostComment.length > 0 ) return <Error {...errorPostComment[0]} reload={true} />;

    if (error) return <Error message="There was an error loading the video comments" reload={true} />;

    return (
        <div className="VideoComments">
            {
                comments.length === 0 ? <div className="NoComments">No Comments</div> :
                    (showAll || comments.length < 20 ? comments : comments.slice(0, 20)).map((comment) =>
                        <div className="comment" key={comment.id}>
                            <img alt="profile" className="profile-pic" src={comment.whoCreatedProfilePicture} />

                            <div className="det">
                                <div className="name-date">
                                    <div className="name">{comment.whoCreatedName}</div>
                                    <div className="date">&nbsp; {getDiff(new Date(new Date(comment.updatedAt!).toLocaleString()), new Date(new Date().toLocaleString()))} ago </div>
                                </div>

                                <div className="com">{comment.comment}</div>
                            </div>
                        </div>
                    )

            }

            {
                comments.length > 20 ?
                    showAll ? <div className='showmore' onClick={() => setShowAll(false)}>Show Less</div>
                        : <div className='showmore' onClick={() => setShowAll(true)}>Show {comments.length - 20} more</div>
                    : null
            }

            <div className="postComment">
                <textarea className="comment-text" placeholder="write a comment" 
                    onChange={
                        (e) => {
                            setCState(e.target.value)
                        }
                    }
                />

                <div className="submitComment" onClick={
                    () => postComment(cState)
                }>Post Comment</div>
            </div>
        </div>
    )
}
