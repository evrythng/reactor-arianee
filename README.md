# reactor-arianee

## requirements

Node version: `v10.23.0`

## Reactor script configuration

To make the script working, you need to add a few fields to your application custom fields:

- `walletKey`: The key of your wallet. (e.g '0x00000...')
- `certificateURL`: The URL of a hosted JSON that correspond to the certificate you want to deliver 

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
