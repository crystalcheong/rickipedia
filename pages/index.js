import React, { useState, useEffect } from 'react'
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

  const { info, results: defaultResults = [] } = data;

  const [results, updateResults] = useState(defaultResults)

  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });

  const { current } = page

  // Using [current] as a dependency. If it changes, the hook will change
  useEffect(() => {
    // Prevents an extra load request if it's the initial page
    if (current === defaultEndpoint) return;

    async function request() {
      // Request to the API endpoint
      const res = await fetch(current)
      const nextData = await res.json();

      updatePage({
        current, ...nextData.info
      })

      // No [previous] value means first set
      if (!nextData.info?.prev) {
        updateResults(nextData.results)
        return;
      }

      // Concatenate new results to the old
      updateResults(prev => {
        return [
          ...prev, ...nextData.results
        ]
      })

    }

    request()
  }, [current])

  // When triggered, will update [page] with new [current] value
  // hence, triggering hook
  function handleLoadMore() {
    updatePage(prev => {
      return {
        ...prev, current: page?.next
      }
    })
  }

  function handleSearchSubmit(e) {
    e.preventDefault()

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query')

    const value = fieldQuery.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint
    });
  }


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

        <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
          <input name="query" type="search" placeholder="wubba lubba dub dub" />
          <button>Search</button>
        </form>

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
        <button className={styles.load} onClick={handleLoadMore}>
          Load More
        </button>
      </main>

      <footer className={styles.footer}>
        <Link href="https://www.adultswim.com/" passHref>
          <img src="/adult-swim.svg" alt="Vercel Logo" className={styles.logo} />
        </Link>
      </footer>
    </div>
  )
}
