<template>
    <section class="addTransactionForm">
    <!--<div>EXPECTED OUT: {{$v.entry.expected_out}}</div>-->
        <v-layout row wrap>
            <v-flex xs6 md3>
                <v-text-field
                    ref="expected_out"
                    name="transaction_form_expected_out"
                    label="Projected Out"
                    v-model="entry.expected_out"
                    single-line
                    v-validate 
                    data-vv-rules="decimal" 
                    data-vv-as="Expected Out"
                    :rules="[expectedOutRule]"
                    :prefix="$currencySymbol"
                ></v-text-field>
            </v-flex>
            <v-flex xs6 md3>
                <v-text-field
                    name="transaction_form_out"
                    label="Out"
                    v-model="entry.out"
                    single-line
                    v-validate 
                    data-vv-rules="decimal" 
                    data-vv-as="Out"
                    :rules="[outRule]"
                    :prefix="$currencySymbol"
                ></v-text-field>
            </v-flex>
            <v-flex xs6 md3>
                <v-text-field
                    name="transaction_form_in"
                    label="In"
                    v-model="entry.in"
                    single-line
                    v-validate 
                    data-vv-rules="decimal" 
                    data-vv-as="In"
                    :rules="[inRule]"
                    :prefix="$currencySymbol"
                ></v-text-field>
            </v-flex>
            <v-flex xs6 md3>
                <v-text-field
                    name="transaction_form_expected_in"
                    label="Projected In"
                    v-model="entry.expected_in"
                    single-line
                    v-validate 
                    data-vv-rules="decimal" 
                    data-vv-as="Expected In"
                    :rules="[expectedInRule]"
                    :prefix="$currencySymbol"
                ></v-text-field>
            </v-flex>
            <v-flex xs6 md3>
                <v-text-field
                    name="input-1-3"
                    label="Description"
                    v-model="entry.description"
                    single-line
                ></v-text-field>
            </v-flex>
            <v-flex xs6 md3>
                <v-text-field
                    name="input-1-3"
                    label="Category"
                    v-model="entry.category_id"
                    single-line
                ></v-text-field>
            </v-flex>
            <v-flex xs6 md3>
                <v-menu    
                    lazy
                    :close-on-content-click="false"
                    v-model="entry_transaction_date_picker"
                    transition="v-scale-transition"
                    offset-y
                    :nudge-left="40"
                >
                    <v-text-field
                        slot="activator"
                        label="Transaction Date"
                        v-model="entry.transaction_date"
                        prepend-icon="access_time"
                        readonly
                    ></v-text-field>
                    <v-date-picker 
                    :date-format="date => dateFormat(date)"
                    :formatted-value.sync="formatted"
                    v-model="entry.transaction_date" autosave></v-date-picker>
                </v-menu>
            </v-flex>
             <v-flex xs6 md3>
                <v-btn :disabled="!entry.transaction_date" ref="saveEntryBtn" @click.native="saveTransaction">Save</v-btn>
                <v-btn ref="clearEntryBtn" @click.native="clearEntry">Clear</v-btn>
             </v-flex>
        </v-layout>

        <div class="errors" v-show="allErrors.length > 0">
            <v-alert error value="error" v-for="(error, index) in allErrors" :key="index">
                {{error}}
            </v-alert>
        </div>
    </section>
</template>
<script>
import { numeric } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
    name: 'AddTransactionForm',
    validations : {      
        entry: {
            expected_out: {
                numeric
            },
            out: {
                numeric
            },
            expected_in: {
                numeric
            },
            in: {
                numeric
            }
        }
    },
    data() {
        return {
            allErrors: [],
            formatted: null,
            entry: {
                in: '',
                out: '',
                expected_in: '',
                expected_out: '',
                description: '',
                category: '',
                transaction_date: ''
            },
            entry_transaction_date_picker: false
        }
    },
    props: {
        forceFocus: {
            type: Boolean,
            required: false
        },
        transactionData: {
            type: Object,
            required: false
        }
    },
    computed: {
        expectedOutRule() {
            return this.errors.has('transaction_form_expected_out') 
                ? this.errors.first('transaction_form_expected_out')
                : true
        },
        outRule() {
            return this.errors.has('transaction_form_out') 
                ? this.errors.first('transaction_form_out')
                : true
        },
        expectedInRule() {
            return this.errors.has('transaction_form_expected_in') 
                ? this.errors.first('transaction_form_expected_in')
                : true
        },
        inRule() {
            return this.errors.has('transaction_form_in') 
                ? this.errors.first('transaction_form_in')
                : true
        }
    },
    watch: {
        transactionData: function (entry) {
            this.entry = entry
        },
        // focus on the save button when we select a date:
        'entry.transaction_date': function (date) {
            // this.$refs.saveEntryBtn.$el.focus()

            setTimeout(()=> {
                this.$refs.saveEntryBtn.$el.focus()
            }, 500)
        },
        'forceFocus': function (focus) {
            if (focus) {
                this.$refs.expected_out.focus()
            }
        }
    },
    methods: {
        saveTransaction() {
            if (this.entry.id) {
                this.$emit('updateTransaction', this.entry)
            } else {
                this.$emit('saveTransaction', this.entry)
            }
            this.entry = {}
        },
        clearEntry() {
            this.entry = {}
        },
        isNumber,
        showError,
        dateFormat(date) {
        }
    }
}

function isNumber(num) {

}

function showError(msg) {

}
</script>

