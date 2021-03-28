import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import { Layout } from '../components';
import styles from '../styles/Home.module.css';

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
    const res = await fetch(defaultEndpoint);
    const data = await res.json();
    return {
        props: {
            data
        }
    };
}

export default function Home({ data }) {
    const { info, results: defaultResults = [] } = data;

    const [results, updateResults] = useState(defaultResults);

    const [page, updatePage] = useState({
        ...info,
        current: defaultEndpoint
    });

    const { current } = page;
    const [hasError, updateErrorStatus] = useState(false);

    // Using [current] as a dependency. If it changes, the hook will change
    useEffect(() => {
        // Prevents an extra load request if it's the initial page
        if (current === defaultEndpoint) return;

        async function request() {
            // Request to the API endpoint
            const res = await fetch(current);
            const nextData = await res.json();

            if (!nextData?.error) {
                updateErrorStatus(false);

                updatePage({
                    current,
                    ...nextData.info
                });

                // No [previous] value means first set
                if (!nextData.info?.prev) {
                    updateResults(nextData.results);
                    return;
                }

                // Concatenate new results to the old
                updateResults((prev) => {
                    return [...prev, ...nextData.results];
                });
            } else {
                updateErrorStatus(true);
            }
        }

        request();
    }, [current]);

    // When triggered, will update [page] with new [current] value
    // hence, triggering hook
    function handleLoadMore() {
        updatePage((prev) => {
            return {
                ...prev,
                current: page?.next
            };
        });
    }

    function handleSearchSubmit(e) {
        e.preventDefault();

        // Current target = form
        const { currentTarget = {} } = e;
        // Retrieving all elements in [currentTarget]
        const fields = Array.from(currentTarget?.elements);
        const fieldQuery = fields.find((field) => field.name === 'query');

        const value = fieldQuery.value || '';
        const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

        updatePage({
            current: endpoint
        });
    }

    return (
        <Layout>
            <motion.h1
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {
                        scale: 0.8,
                        opacity: 0
                    },
                    visible: {
                        scale: 1,
                        opacity: 1,
                        transition: {
                            delay: 0.4
                        }
                    }
                }}
                className={styles.title}>
                Wubba Lubba <span>Dub Dub!</span>
            </motion.h1>

            <p className={styles.description}>Rick and Morty Character Wiki</p>

            <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
                <input name="query" type="search" placeholder="wubba lubba dub dub" />
                <button>Search</button>
            </form>

            {hasError ? (
                <motion.h2
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {
                            scale: 0.8,
                            opacity: 0
                        },
                        visible: {
                            scale: 1,
                            opacity: 1,
                            transition: {
                                delay: 0.4
                            }
                        }
                    }}
                    className={styles.errorMsg}>
                    Can&#39;t find this in any dimensions
                </motion.h2>
            ) : (
                <>
                    <ul className={styles.grid}>
                        {results.map((result) => {
                            const { id, name, image } = result;

                            return (
                                <Link
                                    href="/character/[id]"
                                    as={`/character/${id}`}
                                    passHref
                                    key={id}>
                                    <motion.li
                                        className={styles.card}
                                        whileHover={{
                                            position: 'relative',
                                            zIndex: 1,
                                            background: 'white',
                                            scale: [1, 1.4, 1.2],
                                            rotate: [0, 10, -10, 0],
                                            transition: {
                                                duration: 0.2
                                            },
                                            filter: [
                                                'hue-rotate(0) contrast(100%)',
                                                'hue-rotate(360deg) contrast(200%)',
                                                'hue-rotate(45deg) contrast(300%)',
                                                'hue-rotate(0) contrast(100%)'
                                            ]
                                        }}>
                                        <Image
                                            src={image}
                                            alt={`${name} Thumbnail`}
                                            width={200}
                                            height={200}
                                        />
                                        <h2>{name}</h2>
                                    </motion.li>
                                </Link>
                            );
                        })}
                    </ul>
                    <button className={styles.load} onClick={handleLoadMore}>
                        Load More
                    </button>
                </>
            )}

            <Link href="/" passHref>
                <div className={styles.pointUp}>👆</div>
            </Link>
        </Layout>
    );
}

Home.propTypes = {
    data: PropTypes.object
};
