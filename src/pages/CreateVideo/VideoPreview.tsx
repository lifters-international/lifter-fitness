import React, { useState, useRef, useEffect } from "react";

export type Props = {
    thumbnailImage: string;
    videoUrl: string;
}

export const PreviewVideo: React.FC<Props> = ({ thumbnailImage, videoUrl }) => {
    const [time, setTime] = useState(0);
    const [preview, setPreview] = useState(true);

    const vidRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        vidRef.current?.addEventListener("pause", function () {
            setPreview(true);
            setTime(time);
        })
    }, [vidRef.current])

    return (
        <div className="PreviewVideo">
            <div className={`imageContainer ${!preview ? " hide" : ""}`}>
                <img src={thumbnailImage} alt="thumbnailImage"  className={`VideoContainer`}  onClick={() => {
                    setPreview(false);
                    vidRef.current?.play();
                }} />
                <span className="timeStamp">{time} / { vidRef.current?.duration ? vidRef.current.duration.toFixed(2) : 0}</span>
            </div>

            <video className={`VideoContainer ${preview ? " hide" : ""}`} controls src={videoUrl} ref={vidRef} />
        </div>
    )
}
