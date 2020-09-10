cd ./packages/fusion-sdk
yarn install
cd ../..


lerna bootstrap
lerna link
netlify-lambda build packages/store/src/functions/product
cd ./packages/store
yarn build