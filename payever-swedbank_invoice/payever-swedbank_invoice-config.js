import * as paymentProvider from 'interfaces-psp-v1-payment-service-provider';

/** @returns {import('interfaces-psp-v1-payment-service-provider').PaymentServiceProviderConfig} */
export function getConfig() {
    return {
        title: 'payever Checkout',
        paymentMethods: [
            {
                hostedPage: {
                    title: 'Swedbank Invoice',
                    billingAddressMandatoryFields: ['CITY'],
                    logos: {
                        white: {
                            svg: 'https://payeverproduction.blob.core.windows.net/miscellaneous/82755506-9b37-4ae9-b380-a4eff9644b41-SWEDBANK.svg',
                            png: 'https://payeverproduction.blob.core.windows.net/miscellaneous/82755506-9b37-4ae9-b380-a4eff9644b41-SWEDBANK.png',
                        },
                        colored: {
                            svg: 'https://payeverproduction.blob.core.windows.net/miscellaneous/82755506-9b37-4ae9-b380-a4eff9644b41-SWEDBANK.svg',
                            png: 'https://payeverproduction.blob.core.windows.net/miscellaneous/82755506-9b37-4ae9-b380-a4eff9644b41-SWEDBANK.png',
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
