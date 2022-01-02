import React, { useState, useEffect, useMemo } from 'react';
import { StyledHeader, StyledDropdown } from "../styles";
import { useParams } from "react-router-dom";
import { catchErrors } from "../utils";
import { getPlaylist, getAudioFeaturesForTracks } from "../spotify";
import { TrackList, SectionWrapper } from "../components";
import axios from 'axios';


const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracksData, setTracksData] = useState(null); 
  const [tracks, setTracks] = useState(null);
  const [fetchingError, setFechingError] = useState(null);
  const [audioFeatures, setAudioFeatures ] = useState(null);
  const [sortValue, setSortValue] = useState('');
  const sortOptions = ['danceability', 'tempo', 'energy']; 

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylist(id);
      setPlaylist(data);
      setTracksData(data.tracks);
    }
    
    catchErrors(fetchData).then(isError => {
      setFechingError(isError);
    });
  }, [id])

  useEffect(() => {
    if (!tracksData) {
      return false;
    }
    
    const fetchNextSongsBatch = async () => {
      if (tracksData.next) {
        const { data } = await axios.get(tracksData.next);
        setTracksData(data);
      }
    }

    setTracks(previousTracks => {
      return [
        ...previousTracks ? previousTracks : [],
        ...tracksData.items
      ]
    })

    catchErrors(fetchNextSongsBatch);

    //Update the audioFeatures using the ids from each track
    const fetchAudioFeatures = async () => {
      const ids = tracksData.items.map(({track}) => {
        return track.id
      }).join(",");
      const {data} = await getAudioFeaturesForTracks(ids);
      setAudioFeatures(audioFeatures => {
        return [
          ...audioFeatures ? audioFeatures : [],
          ...data['audio_features']
        ]
      })
    }
    catchErrors(fetchAudioFeatures);
  }, [tracksData])
  
  //merging audio_features to its correspondent track, returns an arr of objs
  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures) {
      return false;
    }
    return tracks.map(({track}) => {
      const currentTrack = track;
      if (!track.audio_features) {
        const currentTrackAudioFeatures = audioFeatures.find(item => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        })
        currentTrack["audio_features"] = currentTrackAudioFeatures;
      }
      return currentTrack;
    })
  }, [tracks, audioFeatures]);

  
  const sortedTracks = useMemo(() => {
    if (!tracksWithAudioFeatures) {
      return null;
    }
    return [...tracksWithAudioFeatures].sort((aTrack, bTrack) => {
      const aTrackFeatures = aTrack["audio_features"];
      const bTrackFeatures = bTrack["audio_features"];

      if (!aTrackFeatures || !bTrackFeatures) {
        return false;
      }

      return bTrackFeatures[sortValue] - aTrackFeatures[sortValue];
    })
  }, [sortValue, tracksWithAudioFeatures])


  return (
    <>
      {playlist ? (
        <>
          <StyledHeader type="playlist">
            <div className="header__inner">
              <div className="header__img-container" alt="Playlist Artwork">
                {playlist.images.length && playlist.images[0].url && (
                  <img className="header__img" src={playlist.images[0].url} alt="Playlist Artwork" title="Playlist Artwork" />
                )}
              </div>
              <div>
                <div className="header__overline">Playlist</div>
                <h1 className="header__name">{playlist.name}</h1>
                <p className="header__meta">
                  <span>
                    {playlist.tracks.total} Song{playlist.tracks.total != 1 ? "s" : ""}
                  </span>
                  <span>
                    {playlist.followers.total} Follower{playlist.followers.total != 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>
          <main>
            <StyledDropdown active={!!sortValue}>
              <label className="sr-only" htmlFor="order-select">Sort tracks</label>
              <select
                name="track-order"
                id="order-select"
                onChange={(event) => setSortValue(event.target.value)}
              >
              <option value="Sort tracks">Sort Tracks</option>
              {sortOptions.map((sortOption, index)=> {
                return (
                  <option value={sortOption} key={index}>
                  {`${sortOption.charAt(0).toUpperCase()}${sortOption.slice(1)}`}
                  </option>
                )
              })}
              </select>
            </StyledDropdown>
            <SectionWrapper title="Playlist" breadcrumb>
            {sortedTracks && (
              <TrackList 
                tracks={sortedTracks}
              />
            )}
            </SectionWrapper>
          </main>
        </>
      ) : ""}
    </>
  )
}

export default Playlist;
