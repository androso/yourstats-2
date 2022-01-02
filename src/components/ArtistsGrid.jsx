import React, {useEffect } from "react";
import { StyledGrid } from "../styles";

const ArtistsGrid = ({ artists }) => {
  
  return (
    <>
      {artists && artists.length ? (
        
        <StyledGrid type="artist">
          {/* wrapping each artist */}
          {artists.map((artist, index) => {
            return (
              <li className="grid__item" key={index}>
                <div className="grid__item__inner">
                  {artist.images[0] && (
                    <a className="hover-link" href={artist.external_urls.spotify} target="_blank">
                      <div className="grid__item__img">
                        <img src={artist.images[0].url} alt={artist.name} />
                      </div>
                    </a>
                  )}
                  <h3 className="grid__item__name overflow-ellipsis">
                    <a className="hover-link" href={artist.external_urls.spotify} target="_blank">
                    {artist.name}
                    </a>
                  </h3>
                  <p className="grid__item__label">Artist</p>
                </div>
              </li>
            )
          })}
        </StyledGrid>
      ) : (
        <p className="empty-notice">No artists available</p>
      )}
    </>
  )
}
export default ArtistsGrid;