<template>
  <div>行车管理-区域管理</div>
</template>

<script>
import { getChargeTypeProportionAPI } from "@/api/user";
export default {
  methods: {
    async getparkCharge() {
      const res = await getChargeTypeProportionAPI();
    },
  },
  mounted() {
    this.getparkCharge();
  },
};
</script>
