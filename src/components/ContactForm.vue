<template>
    <section class="contactWebForm">
        <header class="drawerHeader contactWebForm__header">
            <h2 v-if="!config.editMode">Create New Contact</h2>
            <h2 v-if="config.editMode">Edit Contact - {{contactNameCopy}}</h2>
        </header>
        <v-divider></v-divider>
        <div class="contactWebForm__fields">
            <v-text-field
                name="contact_name"
                label="First Name"
                id="contact_name"
                required
                ref="firstNameField"
                @keyup.enter.native="initSave"
                v-model="contact.first_name"
            ></v-text-field>
            <v-text-field
                name="contact_name"
                label="Last Name"
                id="contact_name"
                v-model="contact.last_name"
            ></v-text-field>
            <v-text-field
                name="contact_phone"
                label="Phone"
                id="contact_phone"
                v-model="contact.phone"
            ></v-text-field>
            <v-text-field
                name="contact_zip"
                label="Zip"
                id="contact_zip"
                v-model="contact.zip"
            ></v-text-field>
            <v-text-field
                name="contact_email"
                label="Email"
                id="contact_email"
                v-model="contact.email"
            ></v-text-field>


            <v-layout row wrap class="datePicker">
                <v-flex xs12 sm6>
                    <v-text-field
                        name="contact_description"
                        label="Description"
                        id="contact_description"
                        multi-line
                        v-model="contact.description"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-menu
                        lazy
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-left="40"
                        max-width="290px"
                    >
                    <v-text-field
                        slot="activator"
                        label="Date of Birth"
                        v-model="formattedDateOfBirth"
                        prepend-icon="event"
                        readonly
                    ></v-text-field>
                    <v-date-picker 
                        v-model="contact.date_of_birth" 
                        :date-format="date => this.$date(date)"
                        no-title scrollable>
                    </v-date-picker>
                    </v-menu>
                </v-flex>
            </v-layout>
            <div class="actions">
                <v-btn :disabled="!contact.first_name" light @click.native="initSave">Save</v-btn>
            </div>
        </div>
        <v-divider></v-divider>

        <DangerZone
            v-if="config.editMode"
            :compareStr="contact.first_name"
            v-on:deleteConfirmed="initDeleteContact"
            inputLabel="First Name of the Contact"
        >
            <p slot="text">
                Simply type the first name of the contact and click the Delete button to confirm.
            </p>
        </DangerZone>

    </section>
</template>
<script>
import DangerZone from './DangerZone.vue'
export default {
    name: 'ContactWebForm',
    components: {
        DangerZone
    },
    data() {
        return {
            contact: this.initForm(),
            contactNameCopy: '', // save this unmutatable reference
        }
    },
    props: {

        /**
         * Important config information 
         * for the component.
         */
        config: {
            type: Object,
            required: true
        },

        /**
         * is the component being viewed?
         */
        isDrawerActive: {
            type: Boolean,
            required: true
        }
    },
    mounted() {

        // initialize our data here.
        if (this.config.editMode && this.config.contact) {
            this.initData()
        } else {
            this.resetForm()
            this.setCategoryID()
        }

        this.focusFirstField()
    },
    watch: {
        isDrawerActive: function (active) {
            if (!active) return

            // initialize again here mounted() only fires once.
            if (this.config.editMode && this.config.contact) {
                this.initData()
            } else {
                this.resetForm()
                this.setCategoryID()
            }
            
            this.focusFirstField()
        }
    },
    computed: {
        formattedDateOfBirth() {
            return this.contact.date_of_birth
                        ? this.$date(this.contact.date_of_birth)
                        : 'No DoB Entered'
        },
    },
    methods: {        
        initSave() {

            if (!this.contact.first_name) return

            if (this.config.editMode) {
                this.$emit('updateContact', this.contact)
            } else {
                this.$emit('createContact', this.contact)
            }
        },
        initData() {
            this.contact = this.config.contact
            this.contactNameCopy = this.config.contact.first_name + ' ' + this.config.contact.last_name
        },
        focusFirstField() {
            this.$refs.firstNameField.focus()
        },
        initDeleteContact() {
            this.$emit('deleteContact', this.contact)
        },
        initForm() {
            return {
                first_name: '',
                last_name: '',
                phone: '',
                email: '',
                description: '',
                date_of_birth: '',
                category_id: '',
            }
        },
        resetForm() {
            this.contact = this.initForm()
        },
        setCategoryID() {
            this.contact.category_id = this.config.category_id ? this.config.category_id : false
        }
    }
}
</script>
<style lang="scss">

.contactWebForm {

    &__header {
        display: flex;
        justify-content: space-between;

        .actions {

            > * {
                display: flex;
                
                height: 44px;
                width: 44px;

                > * {
                    margin: auto;
                }
            }

            .delete {
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }

    &__fields {
        padding: 2rem 0;

        .actions {
            display: flex;
            justify-content: flex-end;
        }
    }

    .datePicker {
        padding: 2rem 0;
        align-items: flex-end;
    }
}

</style>


