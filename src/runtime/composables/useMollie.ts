import { useNuxtApp } from '#imports';
import type { CreateLocaleInstanceArgs } from '../../types';

/**
 * Composable function to initialize mollie instance and get payment session token
 */
export function useMollie(args: CreateLocaleInstanceArgs = {}) {
    const { $mollie } = useNuxtApp();

    async function init() {
        $mollie.createMollieInstance(args);
    }

    async function getToken(): Promise<string | undefined> {
        const mollieResponse = await $mollie.mollieInstance?.createToken();
        if (mollieResponse?.error) {
            console.error(
                `[useMollie][getToken]: ${mollieResponse.error?.message}`
            );
            throw mollieResponse.error?.message;
        }
        return mollieResponse?.token;
    }

    return {
        init,
        getToken,
    };
}
