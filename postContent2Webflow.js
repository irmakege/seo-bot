const fetch = require('node-fetch');
const env = require('dotenv').config();
const axios = require('axios');

const apiToken = process.env.WEBFLOW_API_KEY;
const collectionId = process.env.WEBFLOW_CMS_COLLECTION_ID;
const siteId = process.env.WEBFLOW_SITE_ID;

const headers = {
  'Authorization': `Bearer ${apiToken}`,
  'accept': 'application/json',
  'Content-Type': 'application/json'
};

const postData = {
  fields: {
    "featured": false,
    "name": 'app', 
    "slug": 'app', 
    "post-body": 'deneme',
    "post-summary": 'deneme',
    "main-image": {
        "fileId": "",
        "url": "",
        "alt": "deneme"
    },
    "slug": "deneme",
    "blog-category": "",
  }
};

const url = `https://api.webflow.com/v2/collections/${collectionId}/items`;
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Bearer ${apiToken}`
  },
  body: JSON.stringify({
    isArchived: false,
    isDraft: false,
    fieldData: postData.fields
  })
}; 

// Step 1: Create a blog post
fetch(url, options)
  .then(res => res.json())
  .then(res => {
    const createdItemId = res['id'];
    console.log('Blog post created:', createdItemId);

    // Step 2: Publish the blog post
    const publishData = {
      itemIds: [createdItemId]
    };

    return axios.post(`https://api.webflow.com/v2/collections/${collectionId}/items/publish`, publishData, { headers });
  })
  .catch(err => console.error('error:' + err));
 