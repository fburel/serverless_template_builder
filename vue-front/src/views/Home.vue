<template>
  <v-container class="ma-6">
    <application-form 
      title="API Description"
      :appName = appName
      :appDesc = appDesc />

    <route-view 
      title="Routes"
      :routes = routes
    />

    <v-toolbar
        flat
      >
        <v-btn
          depressed
          color="primary"
          v-on="validate"
        >
          Generate template
        </v-btn>
        <v-spacer/>
        <v-btn
          depressed
          color="error"
          v-on="reset"
        >
          Reset
        </v-btn>
    </v-toolbar>
    
  </v-container>
</template>

<script>
import Hero from '../components/mixins/Hero.vue';

export default {
  name: "Home",

  metaInfo: { title: "Template Builder for Serverless Application" },

  data : () => ({
    title : "Template Builder for Serverless Application",
    appName : '',
    appDesc : '',
    routes : []
  }),

  methods : {
    reset(){
      this.appName = '';
      this.appDesc = '',
      this.routes = [];
    },
    validate(){
      console.log('appname = ' + this.appName);
      console.log('appdesc = ' + this.appDesc);
      console.log('routes = ' + JSON.stringify(this.routes));
    },
    
  },
  components: {
    Hero: () => import("@/components/mixins/HeroAlt"),
    ApplicationForm: () => import("@/components/ApplicationForm"),
    RouteView: () => import("@/components/RouteView")
  }
};
</script>
