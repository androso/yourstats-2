import React, { useEffect, useState} from "react";
import { catchErrors } from "../utils";
import { getUserPlaylists} from "../spotify";
import { SectionWrapper, PlaylistsGrid, Loader} from "../components";
import axios from 'axios';

const Playlists = () => {
  const [playlistsData, setPlaylistsData] = useState(null);
  const [fetchingError, setFetchingError] = useState(false);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async() => {
      const userPlaylists = await getUserPlaylists();
      setPlaylistsData(userPlaylists.data);
    };

    catchErrors(fetchData).then(isError => {
      setFetchingError(isError);
    });

  }, []);

  useEffect(() => {
    
    if(playlistsData === null) {
      return false;
    }
    const fetchNextPlaylistsBatch = async () => {
      if (playlistsData.next) {
        const { data } = await axios.get(playlistsData.next);
        setPlaylistsData(data);
      }
    }

    setPlaylists(previousPlaylistsArray => {
      return [
        ...previousPlaylistsArray ? previousPlaylistsArray : [],
        ...playlistsData.items
      ]
    });

    catchErrors(fetchNextPlaylistsBatch);
  }, [playlistsData]);

  return (
      <main>
        {(!playlists && fetchingError === false) ? (
          <Loader />
        ) : fetchingError === true ? (
          <p className="empty-notice">No artists available</p>
        ) : playlists && (
          <SectionWrapper
            title="Your Playlists"
            breadcrumb
          >
            {/* we're limiting number of artists for better ux */}
            <PlaylistsGrid
              playlists={playlists}
            />
          </SectionWrapper>
        )}
      </main>
  )
}

export default Playlists;