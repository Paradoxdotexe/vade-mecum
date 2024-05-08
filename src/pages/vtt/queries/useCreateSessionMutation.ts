import { useClientMutation } from '@/common/useClientMutation';

export const useCreateSessionMutation = () => {
  const mutation = useClientMutation<{ sessionId: string }>('POST', '/session');

  return mutation;
};
