import { execSync } from 'child_process';

const args = process.argv.slice(2);

const fnName = args[0];

if (!fnName) {
  console.log(`Usage:
  npm run deploy:lambda <functionName>`);
  process.exit(1);
}

console.log('Transpiling lambda function...');
execSync(
  `npx tsc ./aws/lambda/${fnName}/index.ts --outDir ./lambda_build --module nodenext --moduleResolution node`
);

console.log('Zipping lambda function...');
execSync('cd lambda_build && npx bestzip index.zip index.js && cd ..');

console.log('Deploying lambda function...');
execSync(
  `aws lambda update-function-code --function-name vade-mecum__${fnName} --zip-file fileb://lambda_build/index.zip`
);

console.log(`Lambda function vade-mecum__${fnName} deployed.`);
