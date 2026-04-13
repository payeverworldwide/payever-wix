# payever Wix Plugin 

payever eCommerce payments can be added to Wix using the Service Provider plugin.

To do this:

1. Jump into the Wix Studio
2. Click the dev brackets `{}`
3. Click `Public & Backend`
4. Click the `+` on `Service Plugins`
5. Select `Payment`
6. Name it `payever-<selected-payment>` (case sensitive)
7. Copy the contents of `/payment-provider/<payment>.config.js` & `/payment-provider/<payment>.js` into your files in Wix Studio
8. On `Backend`, click the `+` and select `Add web module`. Name it `payever.api.js`
9. Copy the contents of `payever.api.js` to your file
10. On `Backend` again, click `+` and select `Add .js file`
11. Copy the contents of `http-functions.js` to your file
12. Publish the file changes
13. In your Wix Dashboard select: `Settings > Accept Payments`
14. Enable selected payment method

### You are done. 

