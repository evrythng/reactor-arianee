/* eslint-disable no-undef */

const arianeeEnumUrl = {test:'test.arian.ee', production:'arian.ee'};
let operator = null;
let application = null;
let APPLICATION_API_KEY = '';

const arianeeUrl = arianeeEnumUrl.test; // change to arianeeEnumUrl.production if you want to work in production

/**
 * Load asynchronously the script passed in parameter
 * @param {string} src - the link of the javascript package
 * @returns {Promise<unknown>}
 */
function loadScript(src) {
  return new Promise(function(resolve, reject){
    let script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', function () {
      resolve(script);
    });
    script.addEventListener('error', function (e) {
      reject(e);
    });
    document.body.appendChild(script);
  })
}

/**
 * Create and return an anonymous user
 * If the anonymous user is already created, it returns it.
 */
export const getOperator = async () => {
  if (!operator){
    application = new evrythng.Application(APPLICATION_API_KEY);
    operator = await application.appUser().create({anonymous:true});
    return operator;
  }
  return operator;
};

/**
 * Setup the EVRYTHNG SDK
 * The geolocation is set to false
 */
export const setupEvrythngSdk = async () => {
  await evrythng.setup({
    timeout: 5000,
    geolocation: false,
  });
};

/**
 * Redirect the user to the Arianee app and pass the certificate info to the app
 * @param arianeeCertificateId
 * @param arianeeCertificatePassphrase
 */
export const redirectToTheArianeeApp = (arianeeCertificateId, arianeeCertificatePassphrase) => {
  window.location.href = 'https://'+arianeeUrl+'/'+arianeeCertificateId+','+arianeeCertificatePassphrase;
};

/**
 * Set up the websocket that listen to the _NFTGenerated actions that are related to the thng passed in parameter
 * Once a _NFTGenerated action is created, it redirects the user to the Arianee app
 * @param {string} thngId
 * @returns {Promise<void>}
 */
export const setupWebsockets = async (thngId) => {
  const socket = new WebSocket('wss://ws.evrythng.com:443/thngs/'+thngId+'/actions/_NFTGenerated?access_token='+operator.apiKey);

  socket.addEventListener('message', (message) => {
    const {arianeeCertificatePassphrase, arianeeCertificateId} = JSON.parse(message.data)['customFields'];
    redirectToTheArianeeApp(arianeeCertificateId,arianeeCertificatePassphrase);
  });
};

/**
 * Create a _GenerateNFT action to trigger the reactor script that will generate the certificate
 *
 * If the thng passed in parameter has already the infos of the certificate, it doesn't create the action.
 */
export const triggerReactorScript = async (thngId) => {
  const thng = await operator.thng(thngId).read();
  const {arianeeCertificatePassphrase, arianeeCertificateId, arianeeCertificateHasBeenGenerated} = thng.customFields;

  if (arianeeCertificatePassphrase && arianeeCertificateId) {
    redirectToTheArianeeApp(arianeeCertificateId, arianeeCertificatePassphrase);
    return;
  }

  // the generation has started but isn't finished
  if (arianeeCertificateHasBeenGenerated)
    return;


  const actionType = '_GenerateNFT';
  const payload = {
    type: actionType,
    product: thng.product,
    thng: thngId,
    customFields: {
      generateArianeeCertificate: true
    },
  };

  return operator.thng(thngId).action(actionType)
    .create(payload);
};

/**
 * Setup the EVRYTHNG sdk
 * Setup the websocket
 * Create a _GenerateNFT action
 * @param {string} thngId
 * @param {string} code - The application API Key
 */
export const onApplicationLoad = async (thngId, code) => {
  APPLICATION_API_KEY = code;
  await loadScript('https://d10ka0m22z5ju5.cloudfront.net/js/evrythng/5.9.3/evrythng-5.9.3.js');
  await setupEvrythngSdk();
  await getOperator();
  await setupWebsockets(thngId);
  await triggerReactorScript(thngId);
};
