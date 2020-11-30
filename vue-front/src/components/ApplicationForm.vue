<template>
  <v-form v-model="valid">
     <v-toolbar
        flat
      >
        <v-toolbar-title> {{ title }} </v-toolbar-title>
     </v-toolbar>
    <v-container>
      <v-row>
        <v-text-field
            v-model="appName"
            label="Application name"
            required
          />
      </v-row>
      <v-row>
         <v-text-field
            v-model="appDesc"
            label="Description"
            required
          />
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    
    data: () => ({
     
    }),

    props: {
      title : String,
      appName : String,
      appDesc : String
    },
  }
</script>