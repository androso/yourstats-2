import axios from "axios";
export const serverURL = "https://spotifyapp-bk.androsoa3.repl.co";

const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp"
}
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp)
};

export const logout = () => {
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  
  window.location = window.location.origin;
}

const refreshToken = async () => {
  try {
    if 
    (!LOCALSTORAGE_VALUES.accessToken || LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
    (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000) {
      console.error("No refresh Token available");
      logout();
    }
    const { data } = await axios.get(`${serverURL}/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);

    window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    
    window.location.reload();
  } catch (error) {
    console.log(error);
  }

}

const tokenHasExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  
  if (!accessToken || !timestamp) {
    return false;
  }

  const milisecondsElapsed = Date.now() - Number(timestamp);
  return (milisecondsElapsed / 1000) > Number(expireTime);
}

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const accessToken = urlParams.get("access_token");
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  }
  const hasErrors = urlParams.get("error");


  if (hasErrors || tokenHasExpired() || LOCALSTORAGE_VALUES.accessToken === undefined) {
    refreshToken();
  }

  if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== undefined) {
    return LOCALSTORAGE_VALUES.accessToken;
  }
  
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    for (let property in queryParams) {
      window.localStorage.setItem(property, queryParams[property])
    }
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  return false;
}

export const accessToken = getAccessToken();

axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';

export const getUserProfile = () => axios.get("/me");

export const getUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`);
}


/*
  Get a user's Top artists and tracks
  https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
*/
export const getTopArtists = (time_range = 'short_term') => {
  return axios.get(`/me/top/artists?time_range=${time_range}`);
}
export const getTopTracks = ( time_range = 'short_term') => {
  return axios.get(`/me/top/tracks?time_range=${time_range}`);
}

export const getPlaylist = ( playlist_id ) => {
  return axios.get(`playlists/${playlist_id}`);
}

export const getAudioFeaturesForTracks = ids => {
  return axios.get(`/audio-features?ids=${ids}`)
}
