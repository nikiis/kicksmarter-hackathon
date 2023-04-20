import styles from '@/styles/pages/LiveFeed.module.scss';
import LiveFeed from '@/components/LiveFeed/LiveFeed';
import SvgIcon from '@components/SvgIcon/SvgIcon';
import Image from 'next/image';
import { FC } from 'react';
import client from '../../../apollo-client';
import { getAllLiveFeedsQuery } from '@/queries/liveFeedQuery';
import { AllLiveFeeds } from '@/interfaces/api/LiveFeed';

const LiveFeedPage: FC<AllLiveFeeds> = (liveFeeds) => {
    const firstLiveFeed = liveFeeds.allLiveFeeds.at(0);
    const imgs = [
        'https://f005.backblazeb2.com/file/kicksmarter/2312135/1200_1.jpeg',
        'https://f005.backblazeb2.com/file/kicksmarter/2312135/1200_1.jpeg',
    ];
    return (
        <div className={styles.liveFeedWhole}>
            <div className={styles.liveFeedContainer}>
                <div className={styles.FeedHeading}>
                    <SvgIcon svgName="logoletters" customClass={styles.logoLetters} />
                    <h2> Live Feed</h2>
                </div>
                <div className={styles.liveFeed}>
                    <LiveFeed
                        playerName="Chloe Kelley"
                        timeStamp="14:08"
                        text="has a player a part in the build up to 4 shots so far- more than any other player for us"
                        colour="#65AFC6"
                    />
                    <LiveFeed
                        playerName="Chloe Kelley"
                        timeStamp="14:08"
                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit,Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                        colour="red"
                    />
                    <LiveFeed
                        playerName="Chloe Kelley"
                        timeStamp="14:08"
                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit,Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                        colour="aqua"
                    />
                    <LiveFeed
                        playerName="Chloe Kelley"
                        timeStamp="14:08"
                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit,Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                        colour="antiquewhite"
                    />
                </div>
            </div>
            <div className={styles.graphDataContainer}>
                {imgs.map((img) => (
                    <Image
                        className={styles.graph}
                        src={img}
                        alt="img"
                        width={1000}
                        height={1000}
                        quality={100}
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
