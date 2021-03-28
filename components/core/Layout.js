import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';

import styles from '../../styles/components/Layout.module.css';

export default function Layout({ title, children }) {
    var pageName = title ? `${title} | Rickipedia` : 'Rickipedia';

    return (
        <div className={styles.container}>
            <Head>
                <title>{pageName}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>{children}</main>

            <footer>
                <Link href="https://www.adultswim.com/" passHref>
                    <img src="/adult-swim.svg" alt="Vercel Logo" className={styles.logo} />
                </Link>
            </footer>
        </div>
    );
}

Layout.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired
};
