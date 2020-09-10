cd ./packages/fusion-sdk
yarn install
cd ../..

netlify-lambda build packages/store/src/functions/product

lerna bootstrap
lerna link
cd ./packages/store
yarn build