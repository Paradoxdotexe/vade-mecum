import { execSync } from 'child_process';

console.log('Transpiling lambda layer...');
execSync(
  `npx tsc ./aws/lambda/layer.ts --outDir ./lambda_build/nodejs --module nodenext --moduleResolution node`
);

console.log('Zipping lambda layer...');
execSync('cd lambda_build && npx bestzip layer.zip nodejs && cd ..');

console.log('Deploying lambda layer...');
const response = execSync(
  `aws lambda publish-layer-version --layer-name vade-mecum__layer --compatible-runtimes nodejs20.x --zip-file fileb://lambda_build/layer.zip`
);

const layer = JSON.parse(response.toString());

// lambda functions that rely on the lambda layer
const lambdaFunctions = [
  'login',
  'logout',
  'sendLoginEmail',
  'createCharacter',
  'getOrUpdateCharacter',
  'getCharacters'
];

for (const lambdaFunction of lambdaFunctions) {
  const functionName = `vade-mecum__${lambdaFunction}`;
  console.log(`Updating lambda function ${functionName}...`);
  execSync(
    `aws lambda update-function-configuration --function-name ${functionName} --layers arn:aws:lambda:us-east-1:662280876471:layer:vade-mecum__layer:${layer.Version}`
  );
}

console.log('Lambda layer deployed.');
