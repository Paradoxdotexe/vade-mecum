# Vade Mecum

Vade Mecum is a universe-agnostic, hyper-generalized, d6-based RPG system. Check it out at [vademecum.thenjk.com](https://vademecum.thenjk.com).

## Development

### > `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

To deploy frontend and backend artifacts, [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) must be installed and configured via `aws configure` with the `vade-mecum-deployment-user` credentials.

### > `npm run deploy:client`

Builds and deploys the React client.

### > `npm run deploy:lambda <function-name>`

Updates the lambda function named `vade-mecum__<function-name>` with the code in `/aws/lambda/<function-name>/index.ts`.
