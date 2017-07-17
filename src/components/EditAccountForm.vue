<template>
    <section id="editAccountForm">
        <header>
            <div class="headerControls">
                <v-btn @click.native="$emit('deleteAccount', account)"><v-icon>delete</v-icon></v-btn>
            </div>
        </header>
        <v-text-field
            ref="account_title_field"
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

        <v-btn light @click.native="$emit('updateAccount', account)">Save</v-btn>
    </section>
</template>
<script>
export default {   
    name: 'EditAccountForm',
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
    },
    watch: {
        data: function (val) {
            this.project = val
            this.$refs.account_title_field.focus()
        }
    }
}
</script>
<style lang="scss">
    #editAccountForm {
        header {
            display: flex;
            align-items: center;

            .headerControls {
                margin-left: auto;
            }
        }
    }

</style>


