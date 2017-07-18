export default {
    methods: {
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    }
}

function getCategories() {
    return this.$http()
                .route('api/v1/categories')
                .get()
                .then((done, resp) => {
                    if (resp.status === 200) {
                        done(resp.data)
                    } else {
                        done.fail('Could not retrieve categories', resp)
                    }
                })
                .or(err => {
                    console.error(err)
                })
}

/**
 * Create a new contact category.
 *
 * @param {object} category Category details - name, description.
 * @return {object} Returns an instance of ASQ from the API service.
 */
function createCategory(category) {
    return this.$http()
        .route('api/v1/categories')
        .payload(category)
        .post()
        .then((done, resp) => {
            if (resp.status === 201) {
                done(resp.data)
            } else {
                done.fail('Could not create a new category.', resp)
            }
        })
        .or(err => {
            console.error(err)
        })
}

/**
 * Update an existing contact category.
 *
 * @param {object} category Updated category info.
 * @return {object} Returns an instance of ASQ from the API service.
 */
function updateCategory(category) {
    return this.$http()
        .route('api/v1/categories/' + category.id)
        .payload(category)
        .patch()
        .then((done, resp) => {
            if (resp.status === 200) {
                done(resp.data)
            } else {
                done.fail('Could not update category.')
            }
        })
        .or(err => {
            console.error(err)
        })
}

/**
 * Delete a category.
 *
 * @param {number} category_id Category to delete.
 * @return {object} Returns an instance of ASQ from the API service.
 */
function deleteCategory(category_id) {
    return this.$http()
        .route('api/v1/categories/' + category_id)
        .delete()
        .then((done, resp) => {
            if (resp.status === 200) {
                done(resp.data)
            } else {
                done.fail('Could not delete category.')
            }
        })
        .or(err => {
            console.error(err)
        })
}