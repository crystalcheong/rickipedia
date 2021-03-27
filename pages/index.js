import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json()
  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {

  console.log(data)

  const { results = [] } = data;
  console.log(results)


  return (
    <div className={styles.container}>
      <Head>
        <title>Rickipedia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Wubba Lubba <span>Dub Dub!</span>
        </h1>

        <p className={styles.description}>
          Rick and Morty Character Wiki
        </p>

        <ul className={styles.grid}>

          {
            results.map((result) => {
              const { id, name, image } = result;

              return <Link href={`#${name.replace(/\s+/g, '')}`} passHref key={id}>
                <li className={styles.card}>
                <Image
                src={image}
                alt={`${name} Thumbnail`}
                width={200}
                height={200}
                />
                  <h3>{name}</h3>
                </li>
              </Link>
            })
          }


        </ul>
      </main>

      <footer className={styles.footer}>
        <Link href="https://www.adultswim.com/" passHref>
        <img src="/adult-swim.svg" alt="Vercel Logo" className={styles.logo} />
        </Link>
      </footer>
    </div>
  )
}
