'use strict';

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const {Arianee} = require('@arianee/arianeejs');
const fetch = require("node-fetch");

const arianeeEnvironments = {
  test: 'testnet',
  production: 'mainnet',
}

/**********************************       ARIANEE FUNCTIONS     ************************************/

/******      CERTIFICATES    ******/

/**
 * Create a certificate linked to the wallet passed in parameter
 * @param wallet - The wallet where the certificate will be created
 * @param certificateURL - The URL of the JSON that correspond to the data of the certificate
 * @returns {Promise<Map>} - A map with the id and passphrase of the certificate
 */
const createCertificate = async (wallet, certificateURL) => {
  // fetch certificate content
  let certificate = await fetch(certificateURL);
  let content = await certificate.json();

  // Create a certificate based on a self hosted json
  return await wallet.methods.createCertificate({
    uri: certificateURL, content:content});
}

/**********************************       REACTOR FUNCTIONS     ************************************/


/**
 * Run an async function and take care of calling done() and catching any errors.
 *
 * @param {function} f - The function to run.
 */
const runAsync = f => f().catch(e => logger.error(e.message || e.errors[0])).then(done);

/**
 * Check if the certificate was already created (or is being created)
 * @param {string} thngId
 * @returns {Promise<boolean>}
 */
const checkIfTheCertificateHasAlreadyBeenCreated = async (thngId) => {
  const thng = await app.thng(thngId).read();
  const {arianeeCertificateHasBeenGenerated} = thng.customFields;
  return !!(arianeeCertificateHasBeenGenerated);
}

// @filter(onActionCreated) action.type=_FormSubmitted
export const onActionCreated = ({action}) => runAsync(async () => {
  console.log({action})
  await app.init();

  const {thng, product} = action;
  console.log({thng, product});

  try {
    const thngTags = (await app.thng(thng).read()).tags;
    const thngCustomFields = (await app.thng(thng).read()).customFields;

    if (!thngTags.includes('nftGenerationInProgress')) {
      thngTags.push('nftGenerationInProgress');
      const payload = {tags: thngTags};
      await app.thng(thng).update(payload);
    }

    console.log({thngTags, thngCustomFields});
    const {walletKey, certificateURL, arianeeEnvironment} = app.customFields;
    console.log(app)
    console.log({walletKey, certificateURL, arianeeEnvironment});

    // If the certificate was already created (or is being created), I don't create it
    const alreadyCreated = await checkIfTheCertificateHasAlreadyBeenCreated(thng);
    if (alreadyCreated)
      return;

    app.thng(thng).update({customFields: {...thngCustomFields, 'arianeeCertificateHasBeenGenerated':true}});

    // By default Arianee will be initialized on testnet network
    let environment = arianeeEnvironments.test;
    if (arianeeEnvironment === 'production')
      environment = arianeeEnvironments.production;

    let arianee = await new Arianee().init(environment);
    const wallet = arianee.fromPrivateKey(walletKey);
    console.log('wallet',wallet);

    // Create a certificate
    logger.info('Creating a certificate for ' + thng);
    const {certificateId, passphrase} = await createCertificate(wallet, certificateURL);
    const customFieldsPayload = {...thngCustomFields, 'arianeeCertificatePassphrase':passphrase,'arianeeCertificateId':certificateId, 'arianeeCertificateHasBeenGenerated':true};
    console.log({certificateId, passphrase});
    await app.thng(thng).update({customFields: customFieldsPayload});

    const actionType = '_NFTGenerated';
    const actionPayload = {
      type: actionType,
      product: product,
      customFields: {'arianeeCertificatePassphrase':passphrase,'arianeeCertificateId':certificateId, 'arianeeCertificateHasBeenGenerated':true},
    };

    app.thng(thng).action(actionType).create(actionPayload);

    if (!thngTags.includes('registered')) {
      thngTags.push('registered');
      var thngTagsFiltered = thngTags.filter(function(value, index, arr){ 
          return value !== 'nftGenerationInProgress';
      });
      console.log(thngTagsFiltered)
      const payload = {tags: thngTagsFiltered};
      await app.thng(thng).update(payload);
    }

  } catch (e) {
    logger.error(JSON.stringify(e));
  }

  done();
  
});