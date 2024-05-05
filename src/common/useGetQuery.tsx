import { QueryKey, UseQueryOptions, useQuery } from 'react-query';
import { useVTTUser } from './VTTUser';

export const useGetQuery = <TResponse extends object>(
  queryKey: QueryKey,
  endpoint: string,
  queryOptions?: UseQueryOptions<TResponse>
) => {
  const user = useVTTUser();

  const query = useQuery(
    queryKey,
    () =>
      fetch(`https://api.vademecum.thenjk.com${endpoint}`, {
        method: 'GET',
        credentials: 'include'
      }).then(response => {
        const json = response.json();
        if (response.status === 200) {
          return json as Promise<TResponse>;
        } else {
          if (response.status === 403) {
            user.update(undefined);
          }

          return json.then(Promise.reject.bind(Promise));
        }
      }),
    queryOptions
  );

  return query;
};
