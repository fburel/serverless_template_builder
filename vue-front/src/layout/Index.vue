<template>
  <v-app>

    <home-app-bar :items="menus" />

   
      <v-main>

      <v-fade-transition mode="out-in">
        <section >
          <v-row no-gutters>
            <v-col cols="12">
              <router-view />  
            </v-col>
          </v-row>
        </section>
      </v-fade-transition>
    </v-main>
   

    <home-footer />
  </v-app>
</template>

<script>
export default {
  name: "HomeLayout",

  data: () => ({
    menus: [
      {
        text: "Accueil",
        page: "Home"
      },
      // {
      //   text: "Aide",
      //   page: "HelpDesk"
      // }
    ]
  }),

  components: {
    HomeAppBar: () => import("./AppBar"),
    HomeFooter: () => import("./Footer")
  }
};
</script>

<style lang="sass">
.extra-padding
  padding-bottom: 96px !important
  padding-top: 96px !important

  @media screen and (max-width: 959px)
    padding-top: 48px !important
    padding-bottom: 48px !important
</style>
