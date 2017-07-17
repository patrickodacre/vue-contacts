export default {
    methods: {
        getContacts,
        createContact,
        updateContact,
    }
}

function getContacts() {
    return this.$http()
                .route('api/v1/contacts')
                .get()
                .then((done, resp) => {
                    if (resp.status === 200) {
                        done(resp.data)
                    } else {
                        done.fail('Could not retrieve contacts.', resp)
                    }
                })
                .or(err => {
                    console.error(err)
                })
}


/**
 * Create a new contact.
 *
 * @param {object} contact Contact details from the ContactForm
 * @return {object} Returns an instance of ASQ from the API service.
 */
function createContact(contact) {
    return this.$http()
        .route('api/v1/contacts')
        .payload(contact)
        .post()
        .then((done, resp) => {
            if (resp.status === 201) {

                // const categoryID = resp.data.contact.category_id 
                //                     ? resp.data.contact.category_id
                //                     : 1

                // this.contactsByCategory[categoryID].push(resp.data.contact)
                // this.closeDrawer()
                done(resp.data)
            } else {
                done.fail('Could not create contact')
            }
        })
        .or(err => {
            console.error(err)
        })
}

/**
 * Update an existing contact.
 *
 * @param {number} contact_id Contact to edit.
 * @param {object} payload Updated contact details.
 * @return {object} Returns an instance of ASQ from the API service.
 */
function updateContact(contact_id, payload) {

    return this.$http()
        .route('api/v1/contacts/' + contact_id)
        .payload(payload)
        .patch()
        .then((done, resp) => {
            if (resp.status === 200) {
                const category_id    = resp.data.contact.category_id
                const updatedContact = resp.data.contact

                this.replaceContact(category_id, updatedContact)

                this.closeDrawer()
                done()
            } else {
                done.fail('Could not update contact.')
            }
        })
        .or(err => {
            console.error(err)
        })
}