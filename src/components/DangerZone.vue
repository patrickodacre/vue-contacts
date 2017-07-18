<template>
  <section class="dangerZone">
        <header>
            <h3>Danger Zone</h3>
        </header>
        <div class="dangerZone__text">
            <slot name="text"></slot>
        </div>                
        <div class="dangerZone__confirm">
            <div class="input">
                <v-text-field
                    :label="inputLabel"
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
        inputLabel: {
            type: String,
            required: true
        }
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
<style lang="scss">
    .dangerZone {
        &__confirm {
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: flex-start;

            .input {
                flex: 1 0 200px;
            }

            .button button:disabled:not(.btn--icon):not(.btn--flat) {
                background-color: rgba(255,0,0,0.25) !important;
                color: white;
            }
        }
    }
</style>


