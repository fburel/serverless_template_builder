<template>
  <div>
    <v-app-bar 
    id="home-app-bar" 
    dark
    app 
    color="primary" 
    elevation="1" 
    shrink-on-scroll
    prominent
    fade-img-on-scroll
    height = "80"
    src="https://image.freepik.com/free-vector/computer-technology-isometric-icon-server-room-digital-device-set-element-design-pc-laptop_39422-1026.jpg"
    scroll-target="#scrolling-techniques-3">
      <!-- width should be 18, but this logo sucks -->
      <!-- <base-img
        :src="require('@/assets/logo-tdf.jpg')"
        class="mr-3 hidden-xs-only"
        contain
        max-width="280"
        width="100%"
      /> -->
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon
        v-if="items.length > 1"
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      />

      <v-toolbar-title>Template Builder for Serverless Application</v-toolbar-title>

      <v-spacer />

      <template v-slot:extension v-if="items.length > 1">
        <v-tabs class="hidden-sm-and-down" optional v-model="tab">
          <v-tab
            v-for="(menu, i) in items"
            :key="i"
            :to="{name : menu.page}"
            :exact=true
            :ripple="false"
            active-class="text"
            class="font-weight-bold"
            min-width="96"
            text
          >
            {{ menu.text }}
          </v-tab>
        </v-tabs>
      </template>
      
    </v-app-bar>

    <home-drawer v-model="drawer" :items="items" />
  </div>
</template>

<script>
export default {
  name: "HomeAppBar",

  components: {
    HomeDrawer: () => import("./Drawer")
  },

  data: () => ({
    drawer: null,
    tab: null,
  }),

  props : {
    items : Array
  }
};
</script>
