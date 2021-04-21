import styles from './styles.module.scss'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

export function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', { locale: ptBR })

    return (
        <div className={styles.container}>
            <header>
                <img src={"/logo.svg"}  alt={"Podcastr logo"}/>
            </header>
    
            <p className={styles.text}>O melhor para você ouvir, sempre</p>
            <span className={styles.span}>{currentDate}</span>
        </div>
    )
}