<template>
    <section id="editProjectForm">
        <header>
            <div class="headerControls">
                <v-btn @click.native="$emit('deleteProject', project)"><v-icon>delete</v-icon></v-btn>
            </div>
        </header>
        <v-text-field
            ref="project_title_field"
            name="project_title"
            label="Project Title"
            id="project_title"
            v-model="project.title"
        ></v-text-field>
        <v-text-field
            name="project_description"
            label="Project Description"
            id="project_description"
            multi-line
            v-model="project.description"
        ></v-text-field>

        <v-btn light @click.native="$emit('updateProject', project)">Save</v-btn>
    </section>
</template>
<script>
export default {   
    name: 'EditProjectForm',
    data() {
        return {
            project: this.data
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
            this.$refs.project_title_field.focus()
        }
    }
}
</script>
<style lang="scss">
    #editProjectForm {
        header {
            display: flex;
            align-items: center;

            .headerControls {
                margin-left: auto;
            }
        }
    }

</style>


