<template>
  <v-data-table
    :headers="headers"
    :items="routes"
    hide-default-footer
    sort-by="route"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title> {{ title }} </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Add route
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>

                   <v-select
                      v-model="editedItem.method"
                      :items=supportedMethods
                      label="Method"
                      outlined
                    ></v-select>

                </v-row>
                <v-row>
                    <v-text-field
                      v-model="editedItem.route"
                      label="Route"
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field
                      v-model="editedItem.handler"
                      label="Handler"
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field
                      v-model="editedItem.description"
                      label="Description"
                    ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      supportedMethods: [
        "GET",
        "POST",
        "PUT",
        "DELETE"
      ],
      headers: [
        {
          text: 'Method',
          align: 'start',
          sortable: true,
          value: 'method',
        },
        { text: 'Route', value: 'route', sortable: true },
        { text: 'Handler', value: 'handler', sortable: false },
        { text: 'Description', value: 'description', sortable: false  }
      ],
      routes: [],
      editedIndex: -1,
      editedItem: {
        method: "GET",
        route: '/',
        handler: '',
        description: ''
      },
      defaultItem: {
        method: "GET",
        route: '/',
        handler: '',
        description: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New route' : 'Edit route'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    props : {
      title : String,
      routes : Array
    },

    methods: {
      
      editItem (item) {
        this.editedIndex = this.routes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.routes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.routes.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.routes.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>