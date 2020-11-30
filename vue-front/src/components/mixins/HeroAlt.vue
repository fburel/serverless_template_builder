<template>
  <v-theme-provider dark>
    <section id="hero-alt">
      <base-img
          :height="$vuetify.breakpoint.mdAndUp ? 350 : 225"
          :gradient="gradient"
          :src="img"
          color="#45516b"
          flat
          max-width="100%"
          tile
      >
        <v-row
            align="center"
            class="ma-0 fill-height text-center"
            justify="center"
        >
          <v-col cols="12">

            <base-heading :title="text" space="2" weight="500" />

            <base-divider color="primary" dense />

            {{ subtext }}

          </v-col>
        </v-row>
      </base-img>
    </section>
  </v-theme-provider>
</template>

<script>
// Components
import { HexToRGBA, RGBAtoCSS } from "vuetify/lib/util/colorUtils";

export default {
  name: "SectionHeroAlt",

  provide: {
    heading: { align: "center" }
  },

  props: {
    img: String,
    text: String,
    subtext: String,
  },

  computed: {
    gradient() {
      const color = `${this.$vuetify.theme.themes.light.secondary}CC`;
      const overlay = RGBAtoCSS(HexToRGBA(color));

      return `to top, ${overlay}, ${overlay}`;
    },
  }
};
</script>

<style lang="sass">
#hero-alt
  .v-breadcrumbs__item
    color: #FFFFFF
</style>
