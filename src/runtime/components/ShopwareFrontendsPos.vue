<script setup lang="ts">
import { useMollie, useAsyncData } from '#imports';
import { onMounted, ref, type Ref } from 'vue';
import type { MolliePosTerminal, MollieLocale } from '../../types';
import { useShopwareContext, useUser } from '@shopware-pwa/composables-next';
import type { ClientApiError } from '@shopware-pwa/types';

const emits = defineEmits<{
    (e: 'get-terminals-error', error: string | undefined): void;
    (e: 'save-terminal-error', error: string | undefined): void;
    (e: 'save-terminal-success'): void;
}>();

const props = defineProps<{
    locale?: MollieLocale;
    selectLabel?: string;
    selectDisabledOption?: string;
}>();

const { apiInstance } = useShopwareContext();

const { data: mollieConfig } = await useAsyncData(
    'mollieConfig',
    async () => {
        const response = await apiInstance.invoke.get('/store-api/mollie/config');
        return response.data;
    }
)
// use the locale from the props if it exists, otherwise use the locale from the mollie config
if (mollieConfig.value && props.locale) mollieConfig.value.locale = props.locale;

const { init } = useMollie(mollieConfig.value);
const { user } = useUser();

const terminals: Ref<MolliePosTerminal[] | []> = ref([]);
const selectedTerminal = ref<string | undefined>(undefined);

const getPosTerminals = async () => {
    try {
        const terminalsResponse = await apiInstance.invoke.get(
            '/store-api/mollie/pos/terminals'
        );

        terminals.value = terminalsResponse?.data?.terminals;
    } catch (error) {
        emits('get-terminals-error', error as string);
    }
}

const savePosTerminal = async () => {
    try {
        await apiInstance.invoke.post(
            `/store-api/mollie/pos/store-terminal/${user.value?.id}/${selectedTerminal.value}`,
            {}
        );
        emits('save-terminal-success');
    } catch (err) {
        const error = err as ClientApiError;
        emits('save-terminal-error', error.messages[0].detail);
    }
}

onMounted(async () => {
    await init();
    await getPosTerminals();
});
</script>

<template>
  <div class="mollie-pos">
    <label for="molliePosSelect">
      {{ selectLabel ?? `Please choose your terminal:` }}
    </label>
    <select
      id="molliePosSelect"
      v-model="selectedTerminal"
      class="mollie-select mollie-pos-select"
      @change="savePosTerminal"
    >
      <option
        value=""
        disabled
        selected
      >
        {{ selectDisabledOption ?? `Select your terminal` }}
      </option>
      <option
        v-for="terminal in terminals"
        :key="terminal.id"
        :value="terminal.id"
      >
        {{ terminal.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
@import '../assets/css/mollie-select.css';
</style>
