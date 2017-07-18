<template>
  <section class="dangerZone">
        <header>
            <h3>Danger Zone</h3>
        </header>
        <div class="dangerZone__text">
            Simply type the first name of the contact and click the Delete button to confirm.
        </div>                
        <div class="dangerZone__confirm">
            <div class="input">
                <v-text-field
                    label="First Name of the Contact"
                    v-model="confirmDeleteStr"
                ></v-text-field>
            </div>
            <div class="button">
                <v-btn primary
                    class="tkBtn has-text has-color red" 
                    :disabled="!canDelete"
                    @click.native="confirmDelete">
                    <span>Delete</span>
                    <v-icon>delete</v-icon>
                </v-btn>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    name: 'DangerZoneComponent',
    props: {
        compareStr: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            confirmDeleteStr: ''
        }
    },
    computed: {
        canDelete() {
            return this.compareStr === this.confirmDeleteStr
        }
    },
    methods: {
        confirmDelete() {
            this.$emit('deleteConfirmed')
            this.confirmDeleteStr = ''
        }
    }
}
</script>

