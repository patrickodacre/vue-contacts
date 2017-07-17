<template>
    <section class="contactWebForm">
        <header class="drawerHeader">
            <h2>Create New Contact</h2>
            <v-text-field
                name="contact_name"
                label="First Name"
                id="contact_name"
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
                name="contact_email"
                label="Email"
                id="contact_email"
                v-model="contact.email"
             ></v-text-field>
            <v-date-picker 
                v-model="contact.date_of_birth" autosave></v-date-picker>
            <v-text-field
                name="contact_description"
                label="Description"
                id="contact_description"
                multi-line
                v-model="contact.description"
            ></v-text-field>

            <v-btn light @click.native="initSave">Save</v-btn>
        </header>
    </section>
</template>
<script>
export default {
    name: 'ContactWebForm',
    data() {
        return {
            contact: this.initForm()
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

        if (this.config.editMode && this.config.contact) {
            this.contact = this.config.contact
        } else {
            this.resetForm()
            this.setCategoryID()
        }
    },
    watch: {
        isDrawerActive: function (active) {
            if (!active) return

            if (this.config.editMode && this.config.contact) {
                this.contact = this.config.contact
            } else {
                this.resetForm()
                this.setCategoryID()
            }
        }
    },
    methods: {
        initSave() {
            if (this.config.editMode) {
                this.$emit('updateContact', this.contact.id, this.contact)
            } else {
                this.$emit('createContact', this.contact)
            }
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

