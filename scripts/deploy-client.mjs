import { execSync } from 'child_process';

console.log('Building client...');
execSync('npm run build');

console.log('Uploading files to S3...');
execSync('aws s3 sync ./build s3://vademecum.thenjk.com');

console.log('Invalidating cloudfront cache...');
execSync('aws cloudfront create-invalidation --distribution-id E21FM4AG66XKGE --paths "/*"');

console.log(`Client deployed to https://vademecum.thenjk.com.`);
