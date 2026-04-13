import * as paymentProvider from 'interfaces-psp-v1-payment-service-provider';

/** @returns {import('interfaces-psp-v1-payment-service-provider').PaymentServiceProviderConfig} */
export function getConfig() {
    return {
        title: 'payever Checkout',
        paymentMethods: [
            {
                hostedPage: {
                    title: 'PAYBACK PAY',
                    billingAddressMandatoryFields: ['CITY'],
                    logos: {
                        white: {
                            svg: 'https://payeverproduction.blob.core.windows.net/miscellaneous/4a649a39-4fcf-4be3-b540-b82fa6a39778-payback.svg',
                            png: 'https://payeverproduction.blob.core.windows.net/miscellaneous/4a649a39-4fcf-4be3-b540-b82fa6a39778-payback.png',
                        },
                        colored: {
                            svg: 'https://payeverproduction.blob.core.windows.net/miscellaneous/4a649a39-4fcf-4be3-b540-b82fa6a39778-payback.svg',
                            png: 'https://payeverproduction.blob.core.windows.net/miscellaneous/4a649a39-4fcf-4be3-b540-b82fa6a39778-payback.png',
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
