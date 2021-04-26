import { createContext } from 'react'

interface PlayerContextData {
    episodeList: Array<Episode>
    currentEpisodeIndex: number
    isPlaying: boolean
    play: (episode: Episode) => void
    togglePlay: () => void
    setIsPlayingState: (state: boolean) => void
}

interface Episode {
    title: string
    members: string
    thumbnail: string
    duration: string
    url: string
}

export const PlayerContext = createContext({} as PlayerContextData)

