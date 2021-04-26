import { GetStaticProps } from "next"
import Image from "next/image"
import { api } from "../services/api"
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"
import styles from './home.module.scss'
import Link from 'next/link'
import { useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
  play: (episode) => void
}

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: string;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

export const getStaticProps: GetStaticProps = async() => {
  try {
    const { data } = await api.get('episodes', { 
      params: {
        _limit: 12,
        _order: 'desc',
        _sort: 'published_at'
      }
     })

     const episodes = formatInformation(data)
     const latestEpisodes = episodes.slice(0, 2);
     const allEpisodes = episodes.slice(2, episodes.length)
  
    return { 
      props: { latestEpisodes, allEpisodes },
      revalidate: 60 * 60 * 8 // 8 horas, recebe em segundos
    }
  } catch(ex) {
    console.log('Unable to connect')
  }
}

const formatInformation = (data) => {
  const episodes = data.map(episode => {
    return {
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      url: episode.file.url,
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),

      ...episode,
    }
  })

  return episodes
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}> 
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </div>

                <button type={'button'} onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </thead>
            <tbody>
              {allEpisodes.map(episode => {
                return (
                <tr key={episode.id} style={{ width: 72 }}>
                  <td>
                    <Image 
                      width={120} 
                      height={120} 
                      src={episode.thumbnail} 
                      alt={episode.title} 
                      objectFit="cover" 
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => play(episode)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
                )
              })}
            </tbody>

          </table>
      </section>
    </div>
  )
}