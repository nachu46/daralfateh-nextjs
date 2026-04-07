const axios = require('axios');

const url = 'https://innocent-qualification-hosted-infections.trycloudflare.com/jsonrpc';
const db = 'db_test_apr6';
const username = 'admin';
const password = '4d14d0dbe1203d511253e4979c2ddb8fccf3640f'; // using API key as password

async function testOdoo() {
  try {
    console.log("Authenticating...");
    const authRes = await axios.post(url, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "common",
        method: "authenticate",
        args: [db, username, password, {}]
      },
      id: 1
    });

    if (authRes.data.error) {
      console.error("Auth error:", authRes.data.error);
      return;
    }

    const uid = authRes.data.result;
    console.log("Authenticated with UID:", uid);

    if (!uid) {
      console.error("Authentication failed. Check credentials.");
      return;
    }

    console.log("Fetching products...");
    const searchRes = await axios.post(url, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          db, uid, password,
          "product.template", "search_read",
          [[["sale_ok", "=", true], ["is_published", "=", true]]],
          { fields: ["id", "name", "list_price", "public_categ_ids", "image_1920", "image_1024", "qty_available"], limit: 5 }
        ]
      },
      id: 2
    });

    if (searchRes.data.error) {
      console.error("Search error:", searchRes.data.error);
      return;
    }

    const products = searchRes.data.result;
    console.log("Found products:", products.length);
    if (products.length > 0) {
      console.log("Sample product:", {
        id: products[0].id,
        name: products[0].name,
        price: products[0].list_price,
        categories: products[0].public_categ_ids,
        has_image: !!products[0].image_1920 || !!products[0].image_1024,
        qty: products[0].qty_available
      });
    }

  } catch (error) {
    console.error("Network/Request Error:", error.message);
  }
}

testOdoo();
