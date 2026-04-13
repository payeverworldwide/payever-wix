import * as paymentProvider from 'interfaces-psp-v1-payment-service-provider';

/** @returns {import('interfaces-psp-v1-payment-service-provider').PaymentServiceProviderConfig} */
export function getConfig() {
    return {
        title: 'payever Checkout',
        paymentMethods: [
            {
                hostedPage: {
                    title: 'Santander Instant Payment',
                    billingAddressMandatoryFields: ['CITY'],
                    logos: {
                        white: {
                            svg: 'https://payeverproduction.blob.core.windows.net/miscellaneous/7b00a1bc-8176-4d87-b39a-a932d2716b83-SANTANDER_INSTANT_DE.png.svg',
                            png: 'https://payeverproduction.blob.core.windows.net/miscellaneous/7b00a1bc-8176-4d87-b39a-a932d2716b83-SANTANDER_INSTANT_DE.png.png',
                        },
                        colored: {
                            svg: 'https://payeverproduction.blob.core.windows.net/miscellaneous/7b00a1bc-8176-4d87-b39a-a932d2716b83-SANTANDER_INSTANT_DE.png.svg',
                            png: 'https://payeverproduction.blob.core.windows.net/miscellaneous/7b00a1bc-8176-4d87-b39a-a932d2716b83-SANTANDER_INSTANT_DE.png.png',
                        },
                    },
                },
            },
        ],
        credentialsFields: [
            {
                dropdownField: {
                    name: 'environment',
                    label: 'Environment',
                    options: [
                        {
                            value: 'Sandbox',
                            key: 'https://proxy.staging.devpayever.com',
                        },
                        {
                            value: 'Live',
                            key: 'https://proxy.payever.org',
                        },
                    ],
                },
            },
            {
                simpleField: {
                    name: 'clientId',
                    label: 'Client id',
                },
            },
            {
                simpleField: {
                    name: 'clientSecret',
                    label: 'Client secret',
                },
            },
            {
                dropdownField: {
                    name: 'forceRedirect',
                    label: 'Redirect directly to PSP',
                    options: [
                        {
                            value: 'No',
                            key: '0',
                        },
                        {
                            value: 'Yes',
                            key: '1',
                        },
                    ],
                },
            },
            {
                simpleField: {
                    name: 'websiteUrl',
                    label: 'Site URL (no trailing slash). Eg: https://example.com',
                },
            },
        ],
    };
}
