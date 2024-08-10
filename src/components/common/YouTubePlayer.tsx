import ReactPlayer from "react-player/youtube";

interface YouTubePlayerProps {
    videoUrl: string | null;
}

export default function YouTubePlayer({
    videoUrl,
}: Readonly<YouTubePlayerProps>) {
    if (!videoUrl) return null;

    return (
        <div className="relative aspect-video rounded-md overflow-hidden h-[180px] w-[320px] my-8">
            <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls
                className=""
            />
        </div>
    );
}