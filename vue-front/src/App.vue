<template>
  <v-app>
    <div id="app">
      <layout />
    </div>
  </v-app>
</template>

<script>

export default {
  name: "Serveless tempalet builder for AWS",

  metaInfo: {
    title: 'Serveless tempalet builder for AWS',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },

  components: {
    layout: () => import("@/layout/Index.vue"),
  }
};
</script>