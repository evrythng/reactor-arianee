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
 * Returns the custom fields of the corresponding app
 * @param {string} apiKey - The trusted api key of the app
 * @returns {Promise<Map>} - A map containing the custom fields of the app.
 */
const getCustomFieldsOfTheApp = async (apiKey) => {
  const c = await EVT.api({
    url: '/applications/me',
    authorization: apiKey
  });
  return c.customFields;
}

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

// @filter(onActionCreated) action.customFields.generateArianeeCertificate=true
const onActionCreated = ({action}) => runAsync(async () => {
  const {walletKey, certificateURL, arianeeEnvironment} = await getCustomFieldsOfTheApp(app.apiKey);
  const {thng, product} = action;

  // If the certificate was already created (or is being created), I don't create it
  const alreadyCreated = await checkIfTheCertificateHasAlreadyBeenCreated(thng);

  if (alreadyCreated)
    return;

  app.thng(thng).update({customFields: {'arianeeCertificateHasBeenGenerated':true}});

  // By default Arianee will be initialized on testnet network
  let environment = arianeeEnvironments.test;
  if (arianeeEnvironment === 'production')
    environment = arianeeEnvironments.production;

  let arianee = await new Arianee().init(environment);
  const wallet = arianee.fromPrivateKey(walletKey);

  try {
    // Create a certificate
    logger.info('Creating a certificate for ' + thng);
    const {certificateId, passphrase} = await createCertificate(wallet, certificateURL);
    const customFieldsPayload = {'arianeeCertificatePassphrase':passphrase,'arianeeCertificateId':certificateId, 'arianeeCertificateHasBeenGenerated':true};

    await app.thng(thng).update({customFields: customFieldsPayload});

    const actionType = '_NFTGenerated';
    const actionPayload = {
      type: actionType,
      product: product,
      customFields: customFieldsPayload,
    };

    app.thng(thng).action(actionType).create(actionPayload);

  } catch (e) {
    logger.error(JSON.stringify(e));
  }

  done();
});

module.exports = {
  onActionCreated,
}
