import * as paymentProvider from 'interfaces-psp-v1-payment-service-provider';
import { secrets } from 'wix-secrets-backend.v2';
import { elevate } from 'wix-auth';
import { createPayment, refundPayment } from 'backend/payever.api';

const PAYEVER_PAYMENT_METHOD = 'openbank_pay_bnpl_de';
const PAYEVER_PAYMENT_ISSUER = '';

/**
 * This payment plugin endpoint is triggered when a merchant provides required data to connect their PSP account to a Wix site.
 * The plugin has to verify merchant's credentials, and ensure the merchant has an operational PSP account.
 * @param {import('interfaces-psp-v1-payment-service-provider').ConnectAccountOptions} options
 * @param {import('interfaces-psp-v1-payment-service-provider').Context} context
 * @returns {Promise<import('interfaces-psp-v1-payment-service-provider').ConnectAccountResponse | import('interfaces-psp-v1-payment-service-provider').BusinessError>}
 */
export const connectAccount = async (options, context) => {
    const { credentials } = options;

    // Setup the secrets
    const elevatedListSecretInfo = elevate(secrets.listSecretInfo);
    const elevatedCreateSecret = elevate(secrets.createSecret);
    const elevatedUpdateSecretValue = elevate(secrets.updateSecret);

    // Get existing secrets
    const secretList = await elevatedListSecretInfo();
    const existingSecrets = {};
    for (const secret of secretList.secrets) {
        existingSecrets[secret.name] = secret;
    }

    if (!existingSecrets['PAYEVER_ENVIRONMENT']) {
        const environment = {
            name: 'PAYEVER_ENVIRONMENT',
            value: credentials.environment,
            description: 'payever environment',
        };
        await elevatedCreateSecret(environment);
    } else {
        // Update existing secret
        await elevatedUpdateSecretValue(existingSecrets['PAYEVER_ENVIRONMENT']._id, {
            value: credentials.environment,
        });
    }

    if (!existingSecrets['PAYEVER_CLIENT_ID']) {
        const clientId = {
            name: 'PAYEVER_CLIENT_ID',
            value: credentials.clientId,
            description: 'payever Client ID',
        };
        await elevatedCreateSecret(clientId);
    } else {
        // Update existing secret
        await elevatedUpdateSecretValue(existingSecrets['PAYEVER_CLIENT_ID']._id, {
            value: credentials.clientId,
        });
    }

    if (!existingSecrets['PAYEVER_CLIENT_SECRET']) {
        const clientSecret = {
            name: 'PAYEVER_CLIENT_SECRET',
            value: credentials.clientSecret,
            description: 'payever Client Secret',
        };
        await elevatedCreateSecret(clientSecret);
    } else {
        // Update existing secret
        await elevatedUpdateSecretValue(existingSecrets['PAYEVER_CLIENT_SECRET']._id, {
            value: credentials.clientSecret,
        });
    }

    return {
        credentials,
    };
};

/**
 * This payment plugin endpoint is triggered when a buyer pays on a Wix site.
 * The plugin has to process this payment request but prevent double payments for the same `wixTransactionId`.
 * @param {import('interfaces-psp-v1-payment-service-provider').CreateTransactionOptions} options
 * @param {import('interfaces-psp-v1-payment-service-provider').Context} context
 * @returns {Promise<import('interfaces-psp-v1-payment-service-provider').CreateTransactionResponse | import('interfaces-psp-v1-payment-service-provider').BusinessError>}
 */
export const createTransaction = async (options, context) => {
    const { merchantCredentials, order, wixTransactionId } = options;

    return await createPayment({
        merchantCredentials,
        wixTransactionId,
        order,
        paymentMethod: PAYEVER_PAYMENT_METHOD,
        paymentIssuer: PAYEVER_PAYMENT_ISSUER,
    });
};

/**
 * This payment plugin endpoint is triggered when a merchant refunds a payment made on a Wix site.
 * The plugin has to process this refund request but prevent double refunds for the same `wixRefundId`.
 * @param {import('interfaces-psp-v1-payment-service-provider').RefundTransactionOptions} options
 * @param {import('interfaces-psp-v1-payment-service-provider').Context} context
 * @returns {Promise<import('interfaces-psp-v1-payment-service-provider').CreateR\efundResponse | import('interfaces-psp-v1-payment-service-provider').BusinessError>}
 */
export const refundTransaction = async (options, context) => {
    const { merchantCredentials, pluginTransactionId, refundAmount, wixRefundId } = options;

    const refund = await refundPayment({
        merchantCredentials,
        pluginTransactionId,
        refundAmount,
        wixRefundId
    });

    return refund;
};
