<template>
    <section id="createAccountForm">
        <header>
            <h2>Create New Account</h2>
        </header>
        <v-text-field
                name="account_title"
                label="Account Title"
                id="account_title"
                v-model="account.title"
        ></v-text-field>
        <v-text-field
            name="account_description"
            label="Account Description"
            id="account_description"
            multi-line
            v-model="account.description"
        ></v-text-field>
        <v-text-field
            ref="account_institution_field"
            name="account_institution"
            label="Account Institution"
            id="account_institution"
            v-model="account.institution"
        ></v-text-field>

        <v-btn light @click.native="$emit('saveNewAccount', account)">Create</v-btn>
    </section>
</template>
<script>
export default {   
    name: 'CreateAccountForm',
    data() {
        return {
            account: this.data
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    }
}
</script>

