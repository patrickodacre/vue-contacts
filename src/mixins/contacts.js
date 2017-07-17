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
 * @param {object} contact Updated contact details.
 * @return {object} Returns an instance of ASQ from the API service.
 */
function updateContact(contact_id, contact) {
    return this.$http()
        .route('api/v1/contacts/' + contact_id)
        .payload(contact)
        .patch()
        .then((done, resp) => {
            if (resp.status === 200) {
                done(resp.data)
            } else {
                done.fail('Could not update contact.')
            }
        })
        .or(err => {
            console.error(err)
        })
}