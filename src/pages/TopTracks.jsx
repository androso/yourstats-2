import React, { useEffect, useState } from "react";
import { catchErrors } from "../utils";
import { getTopTracks } from "../spotify";
import { SectionWrapper, TrackList, Loader, TimeRangeButtons } from "../components";


const TopTracks = () => {

    const [topTracks, setTopTracks] = useState(null);
    const [activeRange, setActiveRange] = useState("short");
    const [fetchingError, setFechingError] = useState(false);

    useEffect(async () => {

        const fetchData = async () => {
            const topTracks = await getTopTracks(`${activeRange}_term`);
            setTopTracks(topTracks.data);
        };

        catchErrors(fetchData).then(isError => {
            setFechingError(isError);
        });

    }, [activeRange]);

    return (
        <main>
            {(!topTracks && fetchingError === false) ? (
                <Loader />
            ) : fetchingError === true ? (
                <p className="empty-notice">No tracks available</p>
            ) : topTracks && (
                <SectionWrapper
                    title="Top Tracks"
                    breadcrumb
                >
                    <TimeRangeButtons 
                        setActiveRange={setActiveRange}
                        activeRange={activeRange}
                    />
                    {/* we're limiting number of artists for better ux */}
                    <TrackList
                        tracks={topTracks.items}
                    />
                </SectionWrapper>
            )}

            

        </main>
    )
};

export default TopTracks;
