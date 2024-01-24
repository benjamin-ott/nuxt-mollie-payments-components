<script setup lang="ts">
import type { MollieCreditCardMandate } from '../../types';
import { ref } from 'vue';

const emits = defineEmits<{
    (e: 'change-mandate', mandate: string | undefined): void;
}>();

defineProps<{
    mandates: MollieCreditCardMandate[];
    selectLabel?: string;
    selectDisabledOption?: string;
    mandateOrNewText?: string;
}>();

const activeMandate = ref<string | undefined>(undefined);

const changeMandate = async () => {
    emits('change-mandate', activeMandate.value);
}
</script>

<template>
  <div class="mollie-credit-card-mandates">
    <label for="mollieCreditCardMandateSelect">
      {{ selectLabel ?? `Please choose your mandate:` }}
    </label>
    <select
      id="mollieCreditCardMandateSelect"
      v-model="activeMandate"
      class="mollie-select mollie-mandate-select"
      @change="changeMandate"
    >
      <option
        value=""
        disabled
        selected
      >
        {{ selectDisabledOption ?? `Select your mandate` }}
      </option>
      <option
        v-for="mandate in mandates"
        :key="mandate.id"
        :value="mandate.id"
      >
        {{ mandate.details.cardLabel }} - {{ mandate.details.cardHolder }} - {{ mandate.details.cardNumber }}
      </option>
    </select>

    <p class="mollie-credit-card-mandate-or-new-text">
      {{ mandateOrNewText ?? 'Or enter your credit card details:' }}
    </p>
  </div>
</template>

<style scoped>
@import '../assets/css/mollie-select.css';
</style>
