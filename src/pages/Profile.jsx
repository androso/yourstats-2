import React, { useEffect, useState} from "react";
import { catchErrors } from "../utils";
import { getUserProfile, getUserPlaylists, getTopArtists, getTopTracks } from "../spotify";
import { SectionWrapper, ArtistsGrid, TrackList, PlaylistsGrid, Loader} from "../components";
import { StyledHeader } from "../styles";

const Profile = () => {

  // We need to save the data we fetch from the spotify api through getUserProfile
  const [profile, setProfile] = useState(null); 
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists ] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  
  const [fetchingError, setFechingError] = useState(false);
  
  useEffect(() => {

    const fetchData = async() => {
      const userProfile = await getUserProfile();
      setProfile(userProfile.data);

      const userPlaylists = await getUserPlaylists();
      setPlaylists(userPlaylists.data);

      const topArtists = await getTopArtists();
      setTopArtists(topArtists.data);
      
      const topTracks = await getTopTracks();
      setTopTracks(topTracks.data);
      
    };

    catchErrors(fetchData).then(isError => {
      setFechingError(isError);
    });
    
  }, []);

  return (
      <>

        {profile && (
          <StyledHeader type="user" avatar={profile.images[0].url}>
            <div className="header__inner">
              <div className="header__img-container">
                
              </div>
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">  
                  <span>
                    {profile.followers.total} Playlist{profile.followers.total !== 1 ? "s" : null}
                  </span>
                  <span>
                    {profile.followers.total} Follower{profile.followers.total !== 1 ? "s" : null}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>
        )}
        <main> 
          {(!topArtists && fetchingError === false) ? (
            
              <Loader />
            
            ) : fetchingError === true ? (
              <p className="empty-notice">No artists available</p>
            ) : null
          }

          {topArtists && topTracks && playlists && (
            <>
              <SectionWrapper 
                title="Top artists this month"
                seeAllLink="/top-artists"
              >
                {/* we're limiting number of artists for better ux */}
                <ArtistsGrid
                  artists={topArtists.items.slice(0, 5)}
                />
              </SectionWrapper>

              <SectionWrapper 
                title="Top tracks this month"
                seeAllLink="/top-tracks"
              >
                <TrackList tracks={topTracks.items.slice(0, 8)} />
              </SectionWrapper>

              <SectionWrapper
                title="Your beloved playlists"
                seeAllLink="/playlists"
              >
                <PlaylistsGrid playlists={playlists.items.slice(0,10)} />
              </SectionWrapper>
            </>
          )}
        </main>
      </>
    )
}
export default Profile;
