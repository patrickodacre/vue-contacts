<template>
    <div class="fullWrap">
        <div class="fullWrap__inner">
            <v-btn primary class="tkBtn has-text" @click.native="initNewCategory">
                <v-icon>add</v-icon>
                <span>New Category</span>
            </v-btn>

            <v-progress-circular 
                v-show="loading"
                indeterminate 
                :size="70" 
                :width="4" 
                class="green--text progressSpinner"
            >
            </v-progress-circular>
            <section class="categoryList">
                <v-card v-for="category in categories" :key="category.id">
                    <v-toolbar class="green" dark>
                        <v-toolbar-title>{{category.name}}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click.native="initEditCategory(category)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon @click.native="initNewContact(category.id)">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-list two-line>
                        <div :id="category.id" v-sortable="{ 
                                onAdd, 
                                group: 'contacts', 
                                sort: false, // prevent re-ordering of contacts within a category.
                            }"
                            style="min-height: 50px;">
                            <div v-for="contact in contactsByCategory[category.id]" 
                                :key="contact.id" 
                                :id="contact.id" 
                                class="contactDetails" >
                                <v-list-tile avatar @click.native="initEditContact(contact)"> 
                                    <v-list-tile-avatar>
                                        <img :src="avatarStr(contact.id)"></v-list-tile-avatar>
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{contact.first_name}} {{contact.last_name}}</v-list-tile-title>
                                        <v-list-tile-sub-title v-html="contact.description"></v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </div>
                        </div>
                    </v-list>
                </v-card>
            </section>
            <Drawer :toggle="drawer" v-on:drawerClosed="closeDrawer">
                <component 
                    :is="activeComponent" 
                    :config="formConfig" 
                    :isDrawerActive="drawer"
                    v-on:createCategory="handleCreateCategory"
                    v-on:updateCategory="handleUpdateCategory"

                    v-on:createContact="handleCreateContact"
                    v-on:updateContact="handleUpdateContact"
                    v-on:deleteContact="handleDeleteContact"
                >
                </component>
            </Drawer>
        </div>
    </div>
</template>
<script>
import Drawer from '../components/Drawer.vue'
import ContactForm from '../components/ContactForm.vue'
import CategoryForm from '../components/CategoryForm.vue'
import contacts from '../mixins/contacts'
import categories from '../mixins/categories'

import Bricks from 'bricks.js'

export default {
    name: 'Contacts',
    components: {
        Drawer,
        ContactForm,
        CategoryForm,
    },
    mixins: [contacts, categories],
    data() {
        return {
            loading: true,
            drawer: false,
            activeComponent: '',
            formConfig: {},
            categories: [],
            contacts: [], // master list of contacts. Keep up to date.
            contactsByCategory: {},
        }
    },
    beforeMount,
    mounted,
    methods: {
        openDrawer,
        closeDrawer,

        // avatar
        avatarStr,

        // categories:
        handleCreateCategory,
        handleUpdateCategory,
        initNewCategory,
        initEditCategory,
        replaceCategory,
        getCategoryClass,

        // contacts:
        handleCreateContact,
        handleUpdateContact,
        handleDeleteContact,
        initNewContact,
        initEditContact,

        // contact lists:
        updateContactLists,
        removeContactFromList,
        setContactsByCategory,

        // Sortable:
        onAdd, // event handler
    }
}

function avatarStr(id) {
    if (id > 12) {
        id = 12
    }
    return `https://randomuser.me/api/portraits/men/${id}.jpg`
}

function beforeMount() {

    const categories = this.getCategories()
    const contacts   = this.getContacts()

    this.$http()
        .ASQ()
        .gate(
            categories,
            contacts
        )
        .then((done, categories, contacts) => {
            this.contacts           = contacts
            this.categories         = categories
            this.contactsByCategory = this.$collect(contacts).groupBy('category_id').get()
            this.loading            = false
        })
}

function mounted() {
    // const sizes = [
    //     { columns: 1, gutter: 20 },
    //     { mq: '768px', columns: 2, gutter: 20 },
    //     { mq: '1024px', columns: 3, gutter: 20 }
    // ]

    // const instance = Bricks({
    //     container: '.categoryList',
    //     sizes,
    //     packed: 'data-packed'
    // })

    // instance.pack()
    // instance.resize(true)
}

function getCategoryClass(id) {
    return `contactList__${id}`
}

/* ==================================
Contacts:
==================================== */
function handleCreateContact(contact) {
    this.createContact(contact)
        .val( data => {
            const categoryID = data.contact.category_id 
                                    ? data.contact.category_id
                                    : 1

            this.contactsByCategory[categoryID].push(data.contact)
            this.closeDrawer()
        })
}

function handleUpdateContact(contact) {
    this.updateContact(contact.id, contact)
        .val( data => {
            this.updateContactLists(data.contact, true)
            this.closeDrawer()
        })
}

function handleDeleteContact(contact) {
    this.deleteContact(contact.id)
        .val( data => {
            this.removeContactFromList(data.contact.id)
            this.closeDrawer()
        })
}

/**
 * Init a new contact for a chosen category.
 *
 * @param {number} category_id Contact category.
 * @return {undefined}
 */
function initNewContact(category_id = false) {
    this.activeComponent        = 'ContactForm'
    this.formConfig             = {}
    this.formConfig.category_id = category_id

    this.openDrawer()
}

/**
 * Init editing an existing contact.
 *
 * @param {object} contact Contact details.
 * @return {undefined}
 */
function initEditContact(contact) {
    this.activeComponent = 'ContactForm'
    this.formConfig      = {
        contact: this.$collect(contact).clone().get(), // avoid mutating by reference 
        editMode: true
    }

    this.openDrawer()
}


/* ==================================
Categories
==================================== */
 
/**
 * Init a new contact for a chosen category.
 *
 * @return {undefined}
 */
function initNewCategory() {
    this.activeComponent = 'CategoryForm'
    this.formConfig      = {}

    this.openDrawer()
}
/**
 * Init edit existing category
 *
 * @param {object} category The category
 * @return {undefined}
 */
function initEditCategory(category) {
    this.activeComponent = 'CategoryForm'
    this.formConfig      = {
        category: this.$collect(category).clone().get(), // avoid mutating by reference
        editMode: true
    }

    this.openDrawer()
}

function handleCreateCategory(category) {
    this.createCategory(category)
        .val( data => {
            this.categories.push(resp.data.category)

            // add new category to look up
            this.contactsByCategory[resp.data.category.id] = [] 

            this.closeDrawer()
        })
}

function handleUpdateCategory(category) {
    this.updateCategory(category)
        .val( data => {
            this.replaceCategory(data.category)
            this.closeDrawer()
        })
}

/**
 * Replace old category info with the newly updated category info.
 * 
 * @param {object} updatedCategory the new category information.
 * @return {undefined}
 */
function replaceCategory(updatedCategory) {
    this.categories = this.categories.map(category => {
                    if (category.id === updatedCategory.id) {
                        category = updatedCategory
                    }
                    return category
                })
}

/* ==================================
Sortable:
==================================== */

/**
 * Handle onAdd event from Sortable.js
 * 
 * Remove contact from old category list and add
 * to new category list.
 * 
 * @return {undefined}
 */
function onAdd(evt) {
    const moved_contact_id = evt.item.id
    const new_category_id  = evt.target.id
    const prev_category_id = evt.from.id

    this.updateContact(moved_contact_id, {category_id: new_category_id})
        .val( data => {
            this.updateContactLists(data.contact)
        })
}

/**
 * Update this.contacts and this.contactsByCategory
 * 
 * Using Sortable.js contact nodes can appear twice
 * in a list if we update our lists manually.
 * My efforts to keep track of each category and
 * contact clash with Sortable.
 * 
 * Instead, I just keep this.contacts up to date when
 * I've moved with Sortable, and I only reset the 
 * contactsByCategory lookup object when I have altered 
 * a contact's details.
 * 
 * @param {object} updatedContact Contact details.
 * @param {boolean} redraw redraw contactsByCategory?
 * @return {undefined}
 */
function updateContactLists(updatedContact, redraw = false) {
    this.contacts = this.contacts
                        .map(contact => {
                            if (contact.id === updatedContact.id) {
                                contact = updatedContact
                            }
                            return contact
                        })

    /* 
    for whatever reason, the contacts don't reorder when we 
    redraw after a contact has been updated, but only after
    a Sortable drag / drop to another list.
    */
    if (redraw) {
        this.setContactsByCategory(this.contacts)
    }
}

/**
 * Remove a contact from the UI after deletion.
 * 
 * Must set the contactsByCategory lookup obj
 * as well to redraw the UI
 * 
 * @param {number} deletedContactID
 * @return {undefined}
 */
function removeContactFromList(deletedContactID) {
    this.contacts = this.contacts
                        .filter(contact => contact.id !== deletedContactID)

    this.setContactsByCategory(this.contacts)
}

/**
 * Recalc the contactsByCategory lookup obj
 * to refresh the UI
 * 
 * @return {undefined}
 */
function setContactsByCategory(contacts) {
    this.contactsByCategory = this.$collect(contacts).groupBy('category_id').get()
}

/* The Drawer component slides in and out 
from the right and holds a dynamic component 
which will be either a form to add a new category
or a form to add a new contact. */

function openDrawer() {
    this.drawer = true
}

function closeDrawer() {
    this.drawer = false
}

</script>
<style lang="scss">

    .fullWrap {
        min-height: calc(100vh - 100px);
        display: flex;
        flex-flow: column nowrap;

        &__inner {
            flex: 1;
        }
    }
    button.has-text {
        span {
            display: inline-block;
            margin: 0 0.5rem;
        }

        &.has-color i {
            color: white;
        }
    }

    .progressSpinner {
        position: absolute;
        right: 45%;
        top: 45%;
        z-index: 900;
    }

    .categoryList {
        display: flex;
        flex-flow: row wrap;
    }

    .categoryList > .card {
        width: 350px;
        margin: 0.5rem;
    }
</style>


