<template>
    <section class="contactWebForm">
        <header class="drawerHeader">
            <h2>Create New Category</h2>
            <v-text-field
                name="category_name"
                label="Category Name"
                id="category_name"
                v-model="category.name"
             ></v-text-field>
            <v-text-field
                name="category_description"
                label="Category Description"
                id="category_description"
                multi-line
                v-model="category.description"
            ></v-text-field>

            <v-btn light @click.native="initSave">Save</v-btn>
        </header>

        <DangerZone
            v-if="category.id !== 1 && config.editMode"
            :compareStr="category.name"
            v-on:deleteConfirmed="initDeleteCategory"
            inputLabel="Category Name"
        >
            <p slot="text">
                Simply type the name of the category and click the Delete button to confirm.
            </p>
        </DangerZone>
    </section>
</template>
<script>
import DangerZone from './DangerZone.vue'
export default {
    name: 'CategoryWebForm',
    components: {
        DangerZone
    },
    data() {
        return {
            category: this.initForm()
        }
    },
    mounted() {
        if (this.config.editMode && this.config.category) {
            this.category = this.config.category
        } else {
            this.resetForm()
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
    watch: {
        isDrawerActive: function (active) {
            if (!active) return

            if (this.config.editMode && this.config.category) {
                this.category = this.config.category
            } else {
                this.resetForm()
            }
        }
    },
    methods: {
        initSave() {
            if (this.config.editMode) {
                this.$emit('updateCategory', this.category)
            } else {
                this.$emit('createCategory', this.category)
            }
        },
        initForm() {
            return {
                name: '',
                description: ''
            }
        },
        resetForm() {
            this.category = this.initForm()
        },
        initDeleteCategory() {
            if (this.category.id === 1) return

            this.$emit('deleteCategory', this.category)
        }
    }
}
</script>

