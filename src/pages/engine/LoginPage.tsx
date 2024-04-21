import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VButton } from '@/components/VButton';
import { VInput } from '@/components/VInput';
import { VCard } from '@/components/VCard';
import { useMutation } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { VLoader } from '@/components/VLoader';
import { useAuth } from './useAuth';

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .page__content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 440px;

    .content__header {
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #585858;
    }

    .content__form {
      display: flex;
      flex-direction: column;
      gap: 18px;

      .form__info,
      .form__error {
        line-height: 1.5;
        font-size: 15px;
        color: #a0a0a0;
      }

      .form__error {
        color: #ec4343;
      }
    }
  }
`;

type User = {
  id: string;
  email: string;
};

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState<string>();

  const requestLogin = useMutation((email: string) =>
    fetch('https://api.vademecum.thenjk.com/auth/login/request', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    })
  );

  const login = useMutation((token: string) =>
    fetch('https://api.vademecum.thenjk.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      //credentials: 'include',
      body: JSON.stringify({
        token
      })
    }).then(response => {
      const json = response.json();
      if (response.status === 200) {
        return json as Promise<User>;
      } else {
        return json.then(Promise.reject.bind(Promise));
      }
    })
  );

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      login
        .mutateAsync(token)
        .then(auth.setUser)
        .catch(response => {
          if (response.detail) {
            setLoginError(response.detail as string);
          }
        });
    }
  }, []);

  const onSend = () => {
    requestLogin.mutate(email);
  };

  return (
    <Page>
      {login.isLoading ? (
        <VLoader />
      ) : (
        <div className="page__content">
          <div className="content__header">Sign Up or Log In</div>

          <div className="content__form">
            <VCard style={{ padding: 0 }}>
              <VInput
                placeholder="Email"
                value={email}
                onChange={setEmail}
                disabled={requestLogin.isLoading || requestLogin.isSuccess}
                onEnter={onSend}
              />
            </VCard>

            <VButton
              size="large"
              type="primary"
              onClick={onSend}
              disabled={requestLogin.isSuccess || !email}
              loading={requestLogin.isLoading}
            >
              Continue
            </VButton>

            {requestLogin.isSuccess && (
              <div className="form__info">
                A magic link has been emailed to <strong>{email}</strong>.
                <br />
                Click the link to finish signing up or logging in.
              </div>
            )}
            {!requestLogin.isSuccess && login.isError && (
              <div className="form__error">{loginError ?? 'Something went wrong.'}</div>
            )}
          </div>
        </div>
      )}
    </Page>
  );
};
