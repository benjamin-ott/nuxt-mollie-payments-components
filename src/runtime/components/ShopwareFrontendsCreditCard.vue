<script setup lang="ts">
import { useShopwareContext, useUser } from '@shopware-pwa/composables-next';
import type { MollieLocale } from '../../types';
import { computed, ref } from 'vue';
import { useAsyncData } from '#imports';

const emits = defineEmits<{
    (e: 'submit', token: string | undefined): void;
    (e: 'error', error: string | undefined): void;
    (e: 'store-mandate', mandateId: string | undefined): void;
}>();

const props = defineProps<{
    locale?: MollieLocale;
    submitButtonLabel?: string;
    submitDisabled?: boolean;
    saveCardDetailsCheckboxLabel?: string;
    mandatesSelectLabel?: string;
    mandatesSelectDisabledOption?: string;
    mandateOrNewText?: string;
}>();

const { apiInstance } = useShopwareContext();

// get the mollie config
const { data: mollieConfig } = await useAsyncData(
    'mollieConfig',
    async () => {
        const response = await apiInstance.invoke.get('/store-api/mollie/config');
        return response.data;
    }
)

// use the locale from the props if it exists, otherwise use the locale from the mollie config
if (mollieConfig.value && props.locale) mollieConfig.value.locale = props.locale;

const { user } = useUser();

// get the mandates for the user if one click payments are active
const { data: mandates } = await useAsyncData(
    'mollieMandates',
    async () => {
        if (!mollieConfig.value?.oneClickPayments || !user.value?.id) return [];
        const response = await apiInstance.invoke.get(`/store-api/mollie/mandates/${user.value?.id}`);
        return response.data?.mandates;
    }
)

// determines if one click payments are actived in the mollie plugin
const oneClickPaymentsActive = computed(() => mollieConfig.value?.oneClickPayments);
// determines if credit card details should be saved
const shouldSaveCardDetail = ref(false);

const onCreditCardSubmit = async (token: string | undefined) => {
    apiInstance.invoke.post(
        `/store-api/mollie/creditcard/store-token/${user.value?.id}/${token}`,
        {
            shouldSaveCardDetail: shouldSaveCardDetail.value,
        }
    );
    emits('submit', token);
};

const onCreditCardError = async (error: string | undefined) => {
    emits('error', error);
};

// called when the user changes the save card details checkbox
const onSaveCardChange = (value: boolean) => {
    shouldSaveCardDetail.value = value;
};

const onMandateChange = (mandateId: string | undefined) => {
    apiInstance.invoke.post(
        `/store-api/mollie/creditcard/store-mandate-id/${user.value?.id}/${mandateId}`
    );
    emits('store-mandate', mandateId);
};
</script>

<template>
  <div class="shopware-frontends-credit-card">
    <MollieCreditCardMandates
      v-if="oneClickPaymentsActive && mandates && mandates.length > 0"
      :mandates="mandates"
      :select-label="mandatesSelectLabel"
      :select-disable-option="mandatesSelectDisabledOption"
      :mandate-or-new-text="mandateOrNewText"
      @change-mandate="onMandateChange"
    />

    <MollieCreditCardComponent
      :mollie-config="mollieConfig"
      :submit-button-label="submitButtonLabel"
      :submit-disabled="submitDisabled"
      :save-card-details-checkbox-label="saveCardDetailsCheckboxLabel"
      @submit="onCreditCardSubmit"
      @error="onCreditCardError"
      @save-card-change="onSaveCardChange"
    />
  </div>
</template>
