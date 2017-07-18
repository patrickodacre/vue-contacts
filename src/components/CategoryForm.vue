<template>
    <section class="categoryWebForm">
        <header class="drawerHeader categoryWebForm__header">
            <h2 v-if="!config.editMode">Create New Category</h2>
            <h2 v-if="config.editMode">Edit Category - {{categoryNameCopy}}</h2>
        </header>
        <v-divider></v-divider>
        <div class="categoryWebForm__fields">
            <v-text-field
                name="category_name"
                required
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

            <div class="actions">
                <div class="errors" v-show="showError">
                    {{errorMessage}}
                </div>
                <v-btn :disabled="showError || !category.name" light @click.native="initSave">Save</v-btn>
            </div>
        </div>
        <v-divider></v-divider>

        <DangerZone
            v-if="category.id !== 1 && config.editMode"
            :compareStr="categoryNameCopy"
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
            category: this.initForm(),
            /* 
            config.category.name is affected by reference,
            so we need a copy of the name to use for validation.
            */
            categoryNameCopy: '', 
            showError: false,
            errorMessage: '',
            categoryNames: [],
        }
    },
    /**
     * Initialize some data.
     */
    mounted() {
        this.categoryNames    = this.config.categoryNames 
                                    ? this.config.categoryNames
                                    : []

        this.category         = (this.config.editMode && this.config.category)
                                    ? this.config.category
                                    : this.initForm()

        this.categoryNameCopy = this.config.editMode ? this.config.category.name : false
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

            this.categoryNames    = this.config.categoryNames 
                                        ? this.config.categoryNames
                                        : []

            this.category         = (this.config.editMode && this.config.category)
                                        ? this.config.category
                                        : this.initForm()

            this.categoryNameCopy = this.config.editMode ? this.config.category.name : false
                                    
        },
        'category.name': function (name) {
            if (this.categoryNames.indexOf(name) !== -1) {
                this.showErrorMessage('You already have a category with this name.')
            } else {
                this.showError = false
            }
        }
    },
    computed: {
        canSave() {
            return this.categoryNames.indexOf(this.category.name) !== -1
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
        initDeleteCategory() {
            if (this.category.id === 1) return

            this.$emit('deleteCategory', this.category)
        },
        showErrorMessage(msg) {
            this.showError    = true
            this.errorMessage = msg
        }
    }
}
</script>
<style lang="scss">

.errors {
    margin-right: auto;
    border: 1px solid red;
    padding: 1rem;
    color: rgba(255, 0, 0, 0.9);
    background: rgba(255, 0, 0, 0.05)
}
    
.categoryWebForm {

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
}
</style>

