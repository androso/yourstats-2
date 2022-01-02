import React from 'react';
import { Link } from "react-router-dom";
import { StyledGrid } from "../styles";

const PlaylistsGrid = ({ playlists }) => {
  
  return (
    <>
      {(playlists && playlists.length) ? (
        <StyledGrid>
          {playlists.map((playlist, index) => {
            return (
              <li className="grid__item" key={index}>
                <Link className="grid__item__inner" to={`/playlists/${playlist.id}`}> 
                  {(playlist.images.length && playlist.images[0]) && (
                    <div className="grid__item__img">
                      <img src={playlist.images[0].url} alt={playlist.name}/>
                    </div>
                  )}
                  <h3 className="grid__item__name overflow-ellipsis">{playlist.name}</h3>
                  <p className="grid__item__label">Playlist</p>
                </Link>
              </li>
            )
          })}
        </StyledGrid>
      ) : (
        <p className="empty-notice">No playlists found :(</p>
      )}
    </>
  )
}
export default PlaylistsGrid; 