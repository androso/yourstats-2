import React, { useEffect, useState } from "react";
import { catchErrors } from "../utils";
import { getTopArtists } from "../spotify";
import { SectionWrapper, ArtistsGrid, Loader, TimeRangeButtons } from "../components";


const TopArtists = () => {

  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState("short");
  const [fetchingError, setFechingError] = useState(false);

  useEffect(async () => {

    const fetchData = async () => {
      const topArtists = await getTopArtists(`${activeRange}_term`);
      setTopArtists(topArtists.data);
    };

    catchErrors(fetchData).then(isError => {
      setFechingError(isError);
    });

  }, [activeRange]);

  return (
    <main>
      {(!topArtists && fetchingError === false) ? (
        <Loader />
      ) : fetchingError === true ? (
        <p className="empty-notice">No artists available</p>
      ) : topArtists && (
        <SectionWrapper
          title="Top Artists"
          breadcrumb
        >
          <TimeRangeButtons
            setActiveRange={setActiveRange}
            activeRange={activeRange}
          />
          {/* we're limiting number of artists for better ux */}
          <ArtistsGrid
            artists={topArtists.items}
          />
        </SectionWrapper>
      )}



    </main>
  )
};

export default TopArtists;
