/*******************
 http-functions.js
 ********************

 'http-functions.js' is a reserved backend file that lets you expose APIs that respond to fetch
 requests from external services.

 Use this file to create functions that expose the functionality of your site as a service.
 This functionality can be accessed by writing code that calls this site's APIs as defined by the
 functions you create here.

 To learn more about using HTTP functions, including the endpoints for accessing the APIs, see:
 https://wix.to/0lZ9qs8

 *********
 Example
 *********

 The following HTTP function example returns the product of 2 operands.

 To call this API, assuming this HTTP function is located in a premium site that is published
 and has the domain "mysite.com", you would use this URL:

 https://mysite.com/_functions/multiply?leftOperand=3&rightOperand=4

 Note: To access the APIs for your site, use one of the endpoint structures documented here:
 https://wix.to/rZ5Dh89

 ***/

import { getSecret } from 'wix-secrets-backend';
import wixPaymentProviderBackend from 'wix-payment-provider-backend';
import { response } from 'wix-http-functions';
import { retrievePayment } from 'backend/payever.api';

export async function post_payever_notification(request) {
    const paymentId = request.query.paymentId;

    try {
        const environment = await getSecret('PAYEVER_ENVIRONMENT');
        const clientId = await getSecret('PAYEVER_CLIENT_ID');
        const clientSecret = await getSecret('PAYEVER_CLIENT_SECRET');

        const payment = await retrievePayment({
            environment,
            clientId,
            clientSecret,
            paymentId,
        });

        // skip notification
        if (payment.status === 'STATUS_NEW') {
            return response({ status: 200 });
        }

        let reasonCode = null;
        switch (payment.status) {
            case 'STATUS_PAID':
                break;
            case 'STATUS_ACCEPTED':
                reasonCode = 5010;
                break;
            case 'STATUS_IN_PROCESS':
                reasonCode = 5010;
                break;
            default:
                reasonCode = 3012;
                break;
        }

        await wixPaymentProviderBackend.submitEvent({
            event: {
                transaction: {
                    wixTransactionId: payment.reference,
                    pluginTransactionId: paymentId,
                    reasonCode,
                },
            },
        });

        console.log('Submitted', payment.status);

        return response({
            status: 200,
        });
    } catch (ex) {
        return response({
            status: 400,
            body: ex?.message,
        });
    }
}
