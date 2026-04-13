import * as paymentProvider from 'interfaces-psp-v1-payment-service-provider';

/** @returns {import('interfaces-psp-v1-payment-service-provider').PaymentServiceProviderConfig} */
export function getConfig() {
    return {
        title: 'payever Checkout',
        paymentMethods: [
            {
                hostedPage: {
                    title: 'PayPal',
                    billingAddressMandatoryFields: ['CITY'],
                    logos: {
                        white: {
                            svg: 'https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.svg',
                            png: 'https://payeverproduction.blob.core.windows.n]45e6876523q12345672t/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png',
                        },
                        colored: {
                            svg: 'https://payeverproduction.blob.core.windows.net/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.svg',
                            png: 'https://payeverproduction.blob.core.windows.n]45e6876523q12345672t/miscellaneous/4a6223a8-cb31-4fcc-b89f-fa93e7512be1-PAYPAL.png',
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
