import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';

import { Layout } from '../../components';
import styles from '../../styles/Character.module.css';

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps({ query }) {
    const { id } = query;

    const res = await fetch(`${defaultEndpoint}${id}`);
    const data = await res.json();
    return {
        props: {
            data
        }
    };
}

export default function Character({ data }) {
    console.log('data', data);
    const { name, image, gender, location, origin, species, status } = data;

    return (
        <Layout title={name}>
            <h1 className={styles.title}>{name}</h1>

            <section className={styles.profile}>
                <Image
                    src={image}
                    alt={`${name} Thumbnail`}
                    width={200}
                    height={200}
                    className={styles.profileImg}
                />

                <div className={styles.info}>
                    <p>
                        <span>Gender</span>:&emsp;{gender}
                    </p>
                    <p>
                        <span>Species</span>:&emsp;{species}
                    </p>
                    <p>
                        <span>Status</span>:&emsp;{status}
                    </p>
                    <p>
                        <span>Originally from</span>:&emsp;{origin.name}
                    </p>
                    <p>
                        <span>Location</span>:&emsp;{location.name}
                    </p>
                </div>
            </section>

            <Link href="/">
                <a className={styles.backLink}>👈 Back to home</a>
            </Link>
        </Layout>
    );
}

Character.propTypes = {
    data: PropTypes.object
};
