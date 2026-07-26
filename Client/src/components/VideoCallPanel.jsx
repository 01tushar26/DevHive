import { LiveKitRoom, GridLayout, ParticipantTile, useTracks, ControlBar, RoomAudioRenderer } from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

const VideoCallPanel = ({ serverUrl, token, onDisconnected }) => {
  if (!token || !serverUrl) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .lk-control-bar {
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          gap: 6px;
          padding: 6px 4px;
          width: 100%;
          box-sizing: border-box;
        }
        .lk-control-bar .lk-button {
          padding: 6px;
          min-width: unset;
          width: 36px;
          height: 36px;
          font-size: 0;
        }
        .lk-control-bar .lk-button svg {
          width: 18px;
          height: 18px;
        }
        .lk-control-bar .lk-button span {
          display: none;
        }
           /* hide the device-selector caret entirely — one click = one action, no dropdown */
  .lk-button-group-menu,
  .lk-media-device-select-caret,
  [data-lk-source="dropdown-trigger"] {
    display: none !important;
  }

  /* just in case any LiveKit popover still renders, contain it visually */
  .lk-device-menu,
  [role="listbox"] {
    position: absolute !important;
    max-width: 200px;
  }
    .lk-pagination-indicator {
  position: absolute;
  top: 8px;
  bottom: auto;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
}
      `}</style>
      <LiveKitRoom
        serverUrl={serverUrl}
        token={token}
        connect={true}
        video={true}
        audio={true}
        onDisconnected={onDisconnected}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        data-lk-theme="default"
      >
        <div style={{ flex: 1, overflow: 'hidden' ,position: 'relative'}}>
          <VideoGrid />
        </div>
          <RoomAudioRenderer />   
        <ControlBar
          controls={{
            microphone: true,
            camera: true,
            screenShare: true,
            chat: false,
            leave: false,
          }}
        />
      </LiveKitRoom>
    </div>
  );
};

// minimal grid of participant tiles — replaces <VideoConference/>'s built-in layout
const VideoGrid = () => {
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  return (
    <GridLayout tracks={tracks} style={{ height: '100%' }}>
      <ParticipantTile />
    </GridLayout>
  );
};

export default VideoCallPanel;