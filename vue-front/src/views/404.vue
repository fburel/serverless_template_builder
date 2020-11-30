<template>
  <div>
    <error-panel code="404" title="Oups! Page non trouvée" />
  </div>
</template>

<script>
export default {
  name: "FourOhFour",

  components: {
    ErrorPanel: () => import("@/components/mixins/ErrorPanel")
  }
};
</script>
