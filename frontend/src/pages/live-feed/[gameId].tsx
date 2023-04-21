import styles from '@/styles/pages/LiveFeed.module.scss';
import LiveFeed from '@/components/LiveFeed/LiveFeed';
import SvgIcon from '@components/SvgIcon/SvgIcon';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import client from '../../../apollo-client';
import { getAllLiveFeedsQuery } from '@/queries/liveFeedQuery';
import { AllLiveFeeds, LiveFeed as LifeFeedType } from '@/interfaces/api/LiveFeed';
import { convertSecondsToMMss } from '@/helpers/helpers';
import PageHeader from '@/components/PageHeader/PageHeader';
import TimeCard from '@/components/TimeCard/TimeCard';

const LiveFeedPage: FC<AllLiveFeeds> = (allLiveFeeds) => {
    const liveFeed = allLiveFeeds.allLiveFeeds;

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [incomingLiveData, setIncomingLiveData] = useState<LifeFeedType[]>([]);
    const indexRef = useRef<number>(0);
    const endRef = useRef<any>(null);

    let [countdown, setCountdown] = useState(1140);
    const [autoScroll, setAutoScroll] = useState<boolean>(true);

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        if (autoScroll) endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [incomingLiveData]);

    useEffect(() => {
        setTimeout(() => {
            if (incomingLiveData.length <= liveFeed.length) {
                setCountdown((countdown += 60));
            }

            if (incomingLiveData.length < liveFeed.length) {
                const feed = liveFeed[indexRef.current];
                if (feed === undefined) return;

                if (autoScroll) setSelectedImages(feed.imgs);
                setIncomingLiveData([...incomingLiveData, feed]);
                indexRef.current += 1;
            }
        }, 2000);
    }, [incomingLiveData]);

    return (
        <div className={styles.liveFeedWrapper}>
            <PageHeader backgroundColour="white" customClass={styles.livefeedPageHeader}>
                <div className={styles.heading}>
                    <div>
                        <h1>
                            <span className={styles.home}>Manchester City WFC</span> -{' '}
                            <span className={styles.away}>Arsenal WFC</span>
                        </h1>
                        <p>
                            SAT, 11-FEB-2023, 12:30 <span className={styles.league}>FA WSL</span>
                        </p>
                    </div>

                    <TimeCard time={convertSecondsToMMss(countdown)} />
                </div>
            </PageHeader>
            <div className={styles.liveFeedWhole}>
                <div className={styles.liveFeedContainer}>
                    <div className={styles.FeedHeading}>
                        <SvgIcon svgName="logoletters" customClass={styles.logoLetters} />
                        <h2>Live Feed</h2>
                        <label>
                            <input type="checkbox" checked={autoScroll} onChange={() => setAutoScroll(!autoScroll)} />
                            Auto-Scroll
                        </label>
                    </div>
                    <div className={styles.liveFeed}>
                        {incomingLiveData.map((feed, index) => (
                            <button
                                key={'feed' + index}
                                onClick={() => setSelectedImages(feed.imgs)}
                                className={feed.imgs.length > 0 ? styles.hasImg : ''}>
                                <LiveFeed
                                    playerName={feed.name}
                                    timeStamp={convertSecondsToMMss(feed.gameClock)}
                                    text={feed.message}
                                    colour={feed.team === 'home' ? '#B3D7DF' : '#BD4E4E'}
                                />
                            </button>
                        ))}
                        <div ref={endRef} className={styles.invisibleDiv} />
                    </div>
                </div>
                <div className={styles.graphDataContainer}>
                    {selectedImages.map((img, index) => (
                        <Image
                            key={'image' + index}
                            className={styles.graph}
                            src={img}
                            alt="img"
                            width={500}
                            height={500}
                            style={{ objectFit: 'contain', objectPosition: 'center' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveFeedPage;

export async function getServerSideProps(context: any) {
    const { params } = context;
    const { gameId } = params;

    const { data } = await client.query({
        query: getAllLiveFeedsQuery,
        variables: { id: gameId },
    });

    return {
        props: {
            allLiveFeeds: data.allLiveFeeds,
            // gameId: gameId,
        },
    };
}
