<template>
  <v-app>
    <!-- Must have the app property -->
    <v-app-bar app>Serverless Template Builder</v-app-bar>

    <v-main>
      <v-container>

        <v-alert
            border="top"
            colored-border
            type="info"
            elevation="2">
          This tools helps you create your own yaml file for the aws sam client
        </v-alert>

        <v-card elevation="2" class="pa-3">
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >

            <v-text-field
                v-model="appName"
                label="app name"
                :rules="nameRules"
                required
            ></v-text-field>

            <v-text-field
                v-model="appDesc"
                label="app description"
            ></v-text-field>

            <v-combobox
                v-model="appRuntime"
                :items="runtimes_list"
                :rules="[v => !!v || 'runtime is required']"
                label="runtime"
                chips
            ></v-combobox>

            <template>
              <v-file-input
                  v-model="currentFile"
                  placeholder="Upload your api description file (csv format)"
                  label="api"
                  prepend-icon="mdi-paperclip"
                  :rules="[v => !!v || 'you must select a file']"
              >
                <template v-slot:selection="{ text }">
                  <v-chip
                      small
                      label
                      color="primary"
                  >
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </template>

            <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
            >
              Submit
            </v-btn>

          </v-form>

          <v-progress-linear
              v-if="progress > 0"
              :value=progress
          />

        </v-card>

        <v-textarea
            class="pa-3"
            v-if="yaml.length > 1"
            outlined
            name="input-7-4"
            label="template.yml"
            :value="yaml"
        ></v-textarea>



      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import SendFormService from "./services/SendFormService";

export default {
  name: 'App',

  components: {
    SendFormService
  },

  data: () => ({
    valid: true,

    appName: '',

    appDesc : '',

    appRuntime: '',

    yaml : '',

    currentFile: undefined,

    runtimes_list: [
      'nodejs12.x',
      'dotnet3'
    ],

    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 20) || 'must be 20 characters max',
      v => (v && v.match(/^[a-z\-]{1,20}/)) || 'Name must be lowercase without space or special characters, only the "-" symbol is allowed'
    ],

    progress: 0,

  }),
  methods: {
    validate () {

      this.yaml = '';

      if(this.$refs.form.validate())
      {
        console.log("valid");

        SendFormService.upload(this.appName, this.appDesc, this.appRuntime, this.currentFile, (event) => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        }).then(response => {
          console.log(response);
          console.log("done");
          this.yaml = response.data;
        }).catch(e => {
          console.log(e);
        })
      }
      else
      {
        console.log("not valid");
      }
    }
  },
};
</script>
