import { useMutation } from 'react-query';
import { useVTTUser } from './VTTUser';

export const usePostMutation = <T extends object>(endpoint: string) => {
  const user = useVTTUser();

  const mutation = useMutation((body: object) =>
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
        return json as Promise<T>;
      } else {
        if (response.status === 403) {
          user.update(undefined);
        }

        return json.then(Promise.reject.bind(Promise));
      }
    })
  );

  return mutation;
};
