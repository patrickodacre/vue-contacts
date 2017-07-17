<template>
    <v-dialog v-model="dialog">
        <v-btn class="green lighten-1" slot="activator">
            Login
        </v-btn>
        <v-card>
            <v-card-title>
                <span class="headline">Enter Email & Password</span>
            </v-card-title>
            <v-card-text>
                <v-text-field label="Email" v-model="username" required></v-text-field>
                <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="blue--text darken-1" flat @click.native="dialog = false">Cancel</v-btn>
                <v-btn class="blue--text darken-1" flat @click.native="login">Login</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'HomeComponent',
    data() {
        return {
            dialog: false,
            username: 'pdodacre@gmail.com',
            password: 'secret'
        }
    },
    methods: {
        login() {

            const {
                client_id,
                client_secret,
                grant_type
            } = this.$store.state.auth

            const payload = {
                client_id,
                client_secret,
                grant_type,
                username: this.username,
                password: this.password
            }

            this.$http()
                .post('http://app_spark_api_2.app/oauth/token', payload)
                .then((done, resp) => {

                    this.dialog = false
                    this.$auth.setToken(resp.data)

                    const tasks = this.getTasks()
                    const sparkData = this.getSparkData()

                    this.$http()
                        .ASQ()
                        .gate(
                            tasks,
                            sparkData
                        )
                        .then((done, tasks, sparkData) => {
                            this.$router.push({ name: 'dashboard' })
                            done()
                        })
                        .pipe(done)

                })
        },
        getSparkData,
        getTasks
    }
}

function getSparkData() {
    return this.$http()
        .get('http://app_spark_api_2.app/api/v1/spark')
        .then((done, resp) => {
            if (resp.status === 200) {
                this.$store.commit('setSparkData', resp.data)
                this.$spark.setSpark(resp.data)
                done(resp.data)
            } else {
                done.fail('Could not retrieve user data.', resp)
            }
        })
        .or(err => {
            console.error(err)
        })
}

function getTasks() {
    return this.$http()
        .get('http://app_spark_api_2.app/api/v1/tasks')
        .then((done, resp) => {
            if (resp.status === 200) {
                this.$store.commit('setTasks', resp.data)
                done(resp.data)
            } else {
                done.fail('Could not retrieve user tasks.', resp)
            }
        })
        .or(err => {
            console.error(err)
        })
}
</script>
