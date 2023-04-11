import { useState, useEffect } from 'react';
import { ApolloClient, WatchQueryFetchPolicy } from '@apollo/client';
import { DocumentNode } from 'graphql';

interface AbortiveQueryOptions {
    client: ApolloClient<object>;
    query: DocumentNode;
    variables: Record<string, unknown>;
    deps: Array<any>;
    onCompleted?: (data: any) => void;
    fetchPolicy?: WatchQueryFetchPolicy;
}

const useAbortiveQuery = ({ client, query, variables, deps, onCompleted, fetchPolicy }: AbortiveQueryOptions) => {
    const [data, setData] = useState<any>();
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [subscription, setSubscription] = useState<any>();

    const cancel = () => {
        subscription.unsubscribe();
    };

    useEffect(() => {
        setLoading(true);

        const watchedQuery = client.watchQuery({
            query,
            variables,
            fetchPolicy: fetchPolicy || 'cache-and-network',
        });

        const sub = watchedQuery.subscribe({
            next(x) {
                if (!x.partial) {
                    setData(x.data);
                    setError(null);
                    setLoading(false);
                    if (onCompleted) onCompleted(x.data);
                }
            },
            error(err) {
                console.log(err);
                setError(err);
                setLoading(false);
            },
            complete() {
                console.log('Completed!');
                setLoading(false);
            },
        });

        setSubscription(sub);

        return () => {
            sub.unsubscribe();
        };
    }, deps);

    return { data, error, loading, cancel };
};

export default useAbortiveQuery;
