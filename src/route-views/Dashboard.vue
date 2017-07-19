<template>
  <section class="dashboard">
    <header class="dashboard__header">
        <h1>Thank You</h1>
    </header>
    <main>
        <p>Thank you for considering this modest demo app.</p>
        <p>Here is where you can read all about the features I've created. The code, of course, is commented to given you an even deeper look into my thoughts as I was developing.</p>
        <h2>Features:</h2>
        <p>
            You will have the ability to create, delete, edit contact categories and add new contacts to any of those categories. Contacts, of course, may be edited and deleted, as well.
        </p>

        <h3>Drag and Drop Contact Management</h3>
        <p>
            Any contact may be dragged around to add / remove it from any category.
        </p>
        <p>
            For this to work, I used the Sortable.js library. I had some interesting challenges trying to get this to play nicely with the reactivity of Vue. In the end, the code isn't too ugly, but I suspect with more time it could be simplified.
        </p>
        <p>
            I was careful to reset the contactsByCategory lookup object at times where the user wouldn't be distracted by the resorting of the contacts on the page. This was tricky.
        </p>
        <h3>Deleting a Category</h3>
        <p>
            When a category with contacts is deleted, those contacts are automatically added to the default "Uncategorized" category, so no contacts are lost.
        </p>
        <h3>Delete Confirmation</h3>
        <p>Before deleting any category or contact, I added a simple confirmation method which forces the user to type the name of the category or contact to confirm their intent to delete. I shamelessly ripped this idea from Github.
        </p>

        <h3>Filter Categories</h3>
        <p>Clearly, the ability to filter categories would be important to someone managing a lot of contacts.</p>
        <p>While I didn't create this to be a tool to manage hundreds of contacts, this little convenience makes it useful for several dozen contacts, at least.</p>
        <p><strong>NOTE:</strong> There is a console error when using this filter. It is a known problem with the version of Vuetify.js I used. Regardless, it is harmless for our purposes.</p>
        

        <h2>Approach to Development</h2>
        <p>
            I've been fortunate enough to work with some really talented UX designers / professionals.
        </p>
        <p>
            I've learned a lot about keeping the end user in mind when developing a feature. 
        </p>
        <p>
            The end user could be a user of the application, or it could be another developer working with my code.
        </p>
        <p>
            Always, I try to keep things as simple and direct as possible.
        </p>
        <h3>Don't Make Me Think</h3>
        <p>I hope you can see a clear attempt to make it as easy as possible for a user to add, edit and delete categories and contacts.</p>
        <ul>
            <li>When adding / editing a category or contact, focus is immediately on the first input and hitting "ENTER" will attempt to save the form.</li>
            <li>Buttons are clear and within easy reach.</li>
            <li>Areas of interaction are already easily recognizable.</li>
        </ul>
    </main>
  </section>
</template>
<script>
export default {
    name: 'DashboardComponent'
}
</script>
<style lang="scss">
    .dashboard {

    }
</style>


