<template>
    <div>
        <v-text-field
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

        <v-btn light @click.native="$emit('saveNewProject', project)">Create</v-btn>
    </div>
</template>
<script>
export default {   
    name: 'CreateProjectForm',
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
    }
}
</script>

