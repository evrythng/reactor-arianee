# reactor-arianee

## requirements

Node version: `v10.23.0`

You need to create `_NFTGenerated` and `_GenerateNFT` action types.

## How it works

When the onActionCreated is triggered, the script checks if a certificate has already been generated for the thng (
by checking the `arianeeCertificateHasBeenGenerated` custom field). 
If it isn't, it sets this field to true.

Then, it generates a certificate and add `arianeeCertificatePassphrase` and `arianeeCertificateId` to the custom fields
of the THNG.

Once it is done, it generates a `_NFTGenerated` action with the certificate information inside.

## Reactor script configuration

To make the script working, you need to add a few fields to your application custom fields:

- `walletKey`: The key of your wallet (e.g '0x00000...').
- `arianeeEnvironment`: The Arianee environment (`test` or `production`)
- `certificateURL`: The URL of a hosted JSON that correspond to the certificate you want to deliver. See the JSON
certificate section to have an example.

## Deploy the reactor script

First, you need to start by cloning this project.

Then, you need to configure a few variables as it is explained in the previous section.

Once you have configured the reactor script, you have to deploy it to your application. To deploy it, you can do it 
manually or use the EVRYTHNG API. I suggest you to use the deploy_reactor command that is defined in the `package.json`. 
You just need to modify this part of the command with your PROJECT_ID and APPLICATION_ID : 
```
PUT 'https://api.evrythng.com/projects/PROJECT_ID/applications/APPLICATION_ID/reactor/script'
```

You also need to update `access_key.secret` with your OPERATOR_API_KEY. To get it, you have to click on your account 
(top right corner of the EVRYTHNG dashboard) and go to `Account settings`.

Finally, you run this command to deploy the script: 
```
npm run deploy_reactor
```

## Using it with the arianee_webapp

In the folder `arianee_webapp`, there is a react application.
You can use it to have an end to end solution for the Arianee integration.

## JSON certificate

Here is an example of a certificate you can use:

```json
{
  "$schema": "https://cert.arianee.org/version1/ArianeeProductCertificate-i18n.json",
  "name": "Luxiva",
  "sku": "YOUR_SKU",
  "gtin": "YOUR_GTIN",
  "brandInternalId": "NYC12345",
  "category": "accessory",
  "intended": "womens",
  "serialnumber": [
    {
      "type": "serialnumber",
      "value": "SERIAL_NUMBER"
    },
    {
      "type": "casenumber",
      "value": "CASE_NUMBER"
    }
  ],
  "subBrand": "Luxiva Cosmetics",
  "model": "PureDerm Cream Soap Original 100g",
  "language": "en-US",
  "description": "<b>Description</b>\nPremium soap bar",
  "subDescription": [],
  "externalContents": [
    {
      "type": "website",
      "title": "EVRYTHNG Website",
      "url": "https://www.evrythng.com/",
      "order": 1
    }
  ],
  "msrp": [
    {
      "msrp": "35000",
      "currency": "EUR",
      "msrpCountry": "Europe"
    },
    {
      "msrp": "32000",
      "currency": "GBP",
      "msrpCountry": "United Kingdom"
    },
    {
      "msrp": "40000",
      "currency": "USD",
      "msrpCountry": "USA"
    }
  ],
  "medias": [
    {
      "mediaType": "picture",
      "type": "product",
      "url": "https://s3.amazonaws.com/evtcdn_02/2/uf/UMyr7GYFSn2HrEwRwmhm8Cdk/Pure%20derm%20cream%20soap.jpg",
      "order": 1
    }
  ],
  "attributes": [
    {
      "type": "color",
      "value": "Gold"
    }
  ],
  "materials": [
    {
      "material": "gold",
      "pourcentage": "50%"
    }
  ],
  "size": [
    {
      "type": "depth",
      "value": "6",
      "unit": "in"
    },
    {
      "type": "depth",
      "value": "3,6",
      "unit": "cm"
    }
  ],
  "manufacturingCountry": "Switzerland",
  "facilityId": "12345",
  "productCertification": [
    {
      "name": "fairtrade"
    }
  ]
}
```
