import { CloudinaryVideo } from "./media/CloudinaryVideo"

export function VideoHandoff(props) {
  return <div className="video-handoff">
    <CloudinaryVideo {...props} />
  </div>
}
