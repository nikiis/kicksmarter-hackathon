import styles from '@/styles/pages/LiveFeed.module.scss';
import LiveFeed from '@/components/LiveFeed/LiveFeed';
import SvgIcon from '@components/SvgIcon/SvgIcon';
import Image from 'next/image';
import { FC, useState } from 'react';
import client from '../../../apollo-client';
import { getAllLiveFeedsQuery } from '@/queries/liveFeedQuery';
import { AllLiveFeeds } from '@/interfaces/api/LiveFeed';
import { convertSecondsToHHmm } from '@/helpers/helpers';

const LiveFeedPage: FC<AllLiveFeeds> = (allLiveFeeds) => {
    const liveFeed = allLiveFeeds.allLiveFeeds;

    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    return (
        <div className={styles.liveFeedWhole}>
            <div className={styles.liveFeedContainer}>
                <div className={styles.FeedHeading}>
                    <SvgIcon svgName="logoletters" customClass={styles.logoLetters} />
                    <h2>Live Feed</h2>
                </div>
                <div className={styles.liveFeed}>
                    {liveFeed.map((feed, index) => (
                        <button
                            key={'feed' + index}
                            onClick={() => setSelectedImages(feed.imgs)}
                            className={feed.imgs.length > 0 ? styles.hasImg : ''}>
                            <LiveFeed
                                playerName={feed.name}
                                timeStamp={convertSecondsToHHmm(feed.gameClock)}
                                text={feed.message}
                                colour={feed.team === 'home' ? '#B3D7DF' : '#BD4E4E'}
                            />
                        </button>
                    ))}
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
