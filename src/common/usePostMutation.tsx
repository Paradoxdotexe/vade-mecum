import { UseMutationOptions, useMutation } from 'react-query';
import { useVTTUser } from './VTTUser';

export const usePostMutation = <
  TResponse extends object = Record<string, never>,
  TBody extends object | void = void
>(
  endpoint: string,
  mutationOptions?: UseMutationOptions<TResponse, unknown, TBody>
) => {
  const user = useVTTUser();

  const mutation = useMutation(
    body =>
      fetch(`https://api.vademecum.thenjk.com${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
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
    mutationOptions
  );

  return mutation;
};
