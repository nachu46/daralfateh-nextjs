const fetch = require('node-fetch');

const ODOO_URL = 'https://pure-eric-starsmerchant-tsunami.trycloudflare.com/jsonrpc';
const ODOO_DB = 'db_biz_it_mar11';
const ODOO_USERNAME = 'admin';
const ODOO_API_KEY = '06c9259a6401db2bedec39e1ef92eeda6d96b15';
const ODOO_PASSWORD = 'admin';

async function testAuth(pwd) {
  try {
    const res = await fetch(ODOO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        id: 1,
        params: {
          service: 'common',
          method: 'authenticate',
          args: [ODOO_DB, ODOO_USERNAME, pwd, {}],
        },
      }),
    });
    const json = await res.json();
    console.log(`Auth result with ${pwd === ODOO_API_KEY ? 'API KEY' : 'PASSWORD admin'}:`, json.result || json.error || 'SUCCESS (uid: ' + json.result + ')');
    return json.result;
  } catch (e) {
    console.error(`Auth error with ${pwd === ODOO_API_KEY ? 'API KEY' : 'PASSWORD admin'}:`, e.message);
    return null;
  }
}

async function run() {
  console.log('Testing connection to NEW Odoo credentials...');
  const res1 = await testAuth(ODOO_API_KEY);
  console.log('Result 1 (API Key):', res1);
  if (!res1) {
    console.log('API key failed, trying password admin...');
    const res2 = await testAuth(ODOO_PASSWORD);
    console.log('Result 2 (Password admin):', res2);
  }
}

run();
