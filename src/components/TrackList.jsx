import { formatDuration } from "../utils";
import React, { useEffect } from "react";
import { StyledTrackList } from "../styles";


const TrackList = ({ tracks }) => {
  
  return (
    <>
      {tracks && tracks.length ? (
        <StyledTrackList>
          {tracks.map((track, index) => {
            //we could make so that clicking on songs or albums sends us to spotify?
            return (
              <li className="track__item" key={index}>
                <div className="track__item__num">{index + 1}</div>
                <div className="track__item__title-group">
                  {track.album.images.length && track.album.images[2] && (
                    <div className="track__item__img">
                      <img src={track.album.images[2].url} alt={track.name} />
                    </div>
                  )}
                  <div className="track__item__name-artist">
                    <div className="track__item__name overflow-ellipsis">
                      {track.name}
                    </div>
                    <div className="track__item__artist overflow-ellipsis">
                      {track.artists.map((artist, index) => {
                        return (
                          <span key={index}>
                            {artist.name}{index !== track.artists.length - 1 && ", "}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="track__item__album overflow-ellipsis">
                  {track.album.name}
                </div>
                <div className="track__item__duration">
                  {formatDuration(track.duration_ms)}
                </div>
              </li>
            )
          })}
        </StyledTrackList>
      ) : (
        <p className="empty-notice">No tracks available</p>
      )}
    </>
  )
}

export default TrackList;