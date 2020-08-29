<template>
  <div>
    <h3>{{ title }}</h3>
    <pre class="bg-gray-300 rounded-lg p-5">{{ value }}</pre>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      default: '',
      type: String,
    },
    value: {
      required: true,
    },
  },
}
</script>
<style scoped>
pre {
  font-size: 10px;
  text-align: start;
}
</style>
