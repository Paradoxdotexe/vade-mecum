# Vade Mecum

Vade Mecum is a universe-agnostic, hyper-generalized, d6-based RPG system. Check it out at [vademecum.thenjk.com](https://vademecum.thenjk.com).

## Development

### Serve Client

```
> npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

To deploy frontend and backend artifacts, [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) must be installed and configured via `aws configure` with the `vade-mecum-deployment-user` credentials.

### Deploy Client

```
> npm run deploy:client
```

Builds and deploys the React client to S3 and Cloudfront.

### Deploy Lambda Function

```
> npm run deploy:lambda <function-name>
```

Updates the lambda function named `vade-mecum__<function-name>` with the code in `/aws/lambda/<function-name>.ts`.

### Deploy Lambda Layer

```
> npm run deploy:lambdaLayer
```

Updates the lambda layer named `vade-mecum__layer` with the code in `/aws/lambda/layer.ts`.

Subsequently updates all lambda functions that use the lambda layer to point to the new version.
