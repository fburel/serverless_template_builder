<template>
  <base-section id="error-panel">
    <base-heading :title="code" />

    <base-subheading class="primary--text" title="Oh!" />

    <base-subheading space="8" :title="title" />

    <div class="text-center">
      <base-btn :to="{ name: 'Home' }">
        Retour a l'accueil
      </base-btn>
    </div>
  </base-section>
</template>

<script>
export default {
  name: "ErrorPanel",
  props: {
    code: String,
    title: String
  },
  provide: {
    heading: { align: "center" }
  }
};
</script>
