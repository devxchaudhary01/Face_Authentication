import { useEffect, useRef } from "react";

const Camera = ({ onVideoReady }) => {
    const videoRef = useRef(null)

    useEffect(() => {
        let stream;

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(s => {
                stream = s;
                videoRef.current.srcObject = stream;
            });

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <video ref={videoRef}
            autoPlay
            muted
            width="250"
            height="250"
            onLoadedMetadata={() => onVideoReady(videoRef.current)}
            className="border-green-500 rounded-full"
        />


    )
}

export default Camera;