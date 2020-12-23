# Arianee - EVRYTHNG Web app

## How it works

When the application is loaded, it reads the `THNG` passed in the url.
Then, it creates an anonymous user and listen to the new actions that are created on the THNG.
Then, if a certificate was already created for this THNG, it redirects the user to the Arianee app.
Otherwise, it creates a `_GenerateNFT` action which triggers the reactor to generate the certificate.
Once the certificate is generated, it redirects the user to the Arianee app.

## EVRYTHNG configuration

In order to use the app, you need to create `_NFTGenerated` and `_GenerateNFT` action types.

## App configuration

- Using Arianee testnet or mainnet

    By default, the app redirects the user to the testnet.
    But if you want to use the mainnet, you can change this line (in `services/evrythngQueries.js`):
    ```
    const arianeeUrl = arianeeEnumUrl.test;
    ```
    to:
    ```
    const arianeeUrl = arianeeEnumUrl.production;
    ```

- Application API Key

    In `services/evrythngQueries.js`, set the variable `APPLICATION_API_KEY` to your application API Key

## Testing locally

To run the app locally, you can do:

1. `$ git clone https://github.com/evrythng/reactor-arianee.git && cd reactor-arianee/arianee_webapp`
2. `$ npm install`
3. `$ npm start`
