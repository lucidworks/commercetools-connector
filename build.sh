cd ./packages/fusion-sdk
yarn install
cd ../..

lerna bootstrap
lerna link
cd ./packages/store
yarn build