import { Permissions, webMethod } from 'wix-web-module';
import { fetch } from 'wix-fetch';

export const createPayment = webMethod(
    Permissions.Anyone,
    async function (options) {
        const { merchantCredentials, wixTransactionId, order, paymentMethod, paymentIssuer } = options;
        const { environment, clientId, clientSecret, forceRedirect, websiteUrl } = merchantCredentials;

        try {
            // Build the payment payload
            const shippingAmount = order.description.charges?.shipping ? order.description.charges.shipping / 100 : 0;
            const rawCartItems = order?.description?.items || [];

            const cartItems = rawCartItems.map((line) => {
                const price = Number(line.price / 100);
                const quantity = Number(line.quantity);

                return {
                    description: line?.description || '',
                    identifier: String(line._id || line.variant_id || ''),
                    name: line?.name || '',
                    quantity: quantity,
                    total_amount: price * quantity,
                    unit_price: price,
                };
            });

            const discountAmount = order.description.charges?.discount ? order.description.charges.discount / 100 : 0;
            if (discountAmount) {
                const discountItem = {
                    identifier: 'discount',
                    name: 'Discount',
                    quantity: 1,
                    total_amount: discountAmount* (-1),
                    unit_price: discountAmount* (-1),
                };

                cartItems.push(discountItem)
            }

            const payload = {
                channel: {
                    name: 'api'
                },
                cart: cartItems,
                locale: order.description.buyerInfo?.buyerLanguage,
                purchase: {
                    amount: order.description.totalAmount / 100,
                    currency: order.description.currency,
                    delivery_fee: shippingAmount,
                },
                urls: {
                    cancel: order.returnUrls.cancelUrl,
                    failure: order.returnUrls.errorUrl,
                    pending: order.returnUrls.pendingUrl,
                    success: order.returnUrls.successUrl,
                    notification: `${websiteUrl}/_functions/payever_notification?paymentId=--PAYMENT-ID--`,
                },
                reference: wixTransactionId,
                payment_method: paymentMethod,
                payment_issuer: (paymentIssuer && paymentIssuer.trim() !== '') ? paymentIssuer : null,
                billing_address: {
                    city: order.description.billingAddress?.city,
                    country: order.description.billingAddress?.countryCode,
                    first_name: order.description.billingAddress?.firstName,
                    last_name: order.description.billingAddress?.lastName,
                    street: order.description.billingAddress?.address,
                    zip: order.description.billingAddress?.zipCode,
                },
                shipping_address: {
                    city: order.description.shippingAddress?.city,
                    country: order.description.shippingAddress?.countryCode,
                    first_name: order.description.shippingAddress?.firstName,
                    last_name: order.description.shippingAddress?.lastName,
                    street: order.description.shippingAddress?.address,
                    zip: order.description.shippingAddress?.zipCode,
                },
                customer: {
                    email: order.description.billingAddress?.email,
                    phone: order.description.billingAddress?.phone,
                    type: 'person',
                },
                payment_data: {
                    force_redirect: Boolean(Number(forceRedirect)),
                },
            };

            console.log('payever createPayment payload:', payload);

            const accessToken = await getAccessToken(environment, clientId, clientSecret);

            const result = await fetch(`${environment}/api/v3/payment`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            }).then((httpResponse) => {
                if (httpResponse.ok) {
                    return httpResponse.json();
                } else {
                    return Promise.reject('Fetch did not succeed');
                }
            });

            console.log('payever createPayment response:', result);

            return {
                pluginTransactionId: result?.call?.id,
                redirectUrl: result.redirect_url,
            };

        } catch (err) {
            console.error('payever createPayment error:', err.message);
            return {
                error: {
                    code: 'PROVIDER_ERROR',
                    message: err.message,
                }
            };
        }
    }
);

export const retrievePayment = webMethod(
    Permissions.Anyone,
    async function (options) {

        const { environment, clientId, clientSecret, paymentId } = options;

        try {
            const accessToken = await getAccessToken(environment, clientId, clientSecret);

            const paymentResponse = await fetch(`${environment}/api/payment/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const responseJson = await paymentResponse.json();

            console.log('Retrieve payment response', responseJson);

            if (!paymentResponse.ok) {
                const errorText = await paymentResponse.text();
                throw new Error(`Retrieve payment request failed: ${paymentResponse.status} - ${errorText}`);
            }

            if (responseJson?.error) {
                throw new Error(responseJson?.error_description || 'payever API error');
            }

            const result = responseJson.result;
            console.log('Retrieve payment result', result);

            return result;
        } catch (err) {
            console.error('payever retrievePayment error:', err.message);

            throw err;
        }
    }
);

export const refundPayment = webMethod(
    Permissions.Anyone,
    async function (options) {

        const { merchantCredentials, pluginTransactionId, refundAmount, wixRefundId } = options
        const { environment, clientId, clientSecret } = merchantCredentials;

        try {
            const accessToken = await getAccessToken(environment, clientId, clientSecret);

            const refundResponse = await fetch(`${environment}/api/payment/refund/${pluginTransactionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'idempotency-key': wixRefundId,
                },
                body: JSON.stringify({ refundAmount }),
            });

            const refund = await refundResponse.json();

            console.log('Refund payment response', refund);

            if (!refundResponse.ok) {
                const errorText = await refundResponse.text();
                throw new Error(`Refund payment request failed: ${refundResponse.status} - ${errorText}`);
            }

            if (refund?.error) {
                throw new Error(refund?.error_description || 'payever API error');
            }

            const result = refund.result;
            console.log('Refund payment result', result);

            return {
                pluginRefundId: result?.id,
            };
        } catch (err) {
            console.error('payever refundPayment error:', err.message);

            return {
                pluginRefundId: pluginTransactionId,
                reasonCode: 3025,
                errorMessage: err.message,
            };
        }
    }
);

export const getAccessToken = webMethod(
    Permissions.Anyone,
    async function (environment, clientId, clientSecret) {
        const formData = new URLSearchParams();
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('grant_type', 'http://payever.org/api/payment');
        formData.append('scope', 'API_CREATE_PAYMENT');

        try {
            const TOKEN_ENDPOINT = `${environment}/oauth/v2/token`;
            const response = await fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Token request failed: ${response.status} - ${errorText}`);
            }

            const tokenData = await response.json();

            if (!tokenData?.access_token) {
                throw new Error('No access_token in response');
            }

            return tokenData.access_token; // Bearer token
        } catch (err) {
            console.error('payever getAccessToken error:', err);
            throw err;
        }
    }
);
