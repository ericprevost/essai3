// Forcer un déploiement Railway
const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
  origin: 'https://www.vie-tal.fr',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

const SHOP = "e93f3c-5.myshopify.com";
const ACCESS_TOKEN = "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";

app.post('/update-birthdate', async (req, res) => {
  const { customerId, birthdate } = req.body;

  const metafieldData = {
    metafield: {
      namespace: 'custom',
      key: 'date_de_naissance',
      type: 'date',
      value: birthdate
    }
  };

  try {
    const response = await fetch(`https://${SHOP}/admin/api/2024-04/customers/${customerId}/metafields.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metafieldData)
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).send({ success: true, data });
    } else {
      res.status(response.status).send({ error: data.errors });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Erreur serveur' });
  }
});
app.post('/update-product', async (req, res) => {
  const { productId, key, value } = req.body;

  const metafield = {
    metafield: {
      namespace: "custom",
      key: key,               // ex: "fabricant"
      type: "single_line_text_field",
      value: value            // ex: "France"
    }
  };

  try {
    const response = await fetch(`https://${SHOP}/admin/api/2024-04/products/${productId}/metafields.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metafield)
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).send({ success: true, data });
    } else {
      res.status(response.status).send({ error: data.errors });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Erreur serveur' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));
