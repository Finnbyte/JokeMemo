<script>
import axios from "axios";
import { onMount } from "svelte";
import { Jokes } from "../lib/jokes";

let jokes = new Jokes();
let enabledCategories = []

$: currentJoke = jokes.history.entries[jokes.history.index - 1]
$: enabledCategories = jokes.categories.filter(category => category.enabled).map((category) => category.name)

onMount(async () => {
    jokes = jokes.loadFromCookies() 

    if ((typeof currentJoke === "undefined" || currentJoke === "") && jokes.history.entries.length <= 0) {
    await fetchNewJoke()
        currentJoke = jokes.history.entries[jokes.history.index - 1]
    }
})

// URL depends on if user wants dark jokes
$: url = !jokes.showDarkJokes ? `https://v2.jokeapi.dev/joke/${enabledCategories}` : `https://v2.jokeapi.dev/joke/${enabledCategories},dark`

const fetchNewJoke = async () => {
    if (enabledCategories.length !== 0) {
        try {
            const res = await axios.get(url)

            // Add to history and goto next index
            jokes = jokes.appendToHistory(res.data); jokes = jokes.next()

            // Save to cookies
            jokes.saveToCookies()
        } catch (err) {
            console.error(err)
        }
    }
}

const handleNext = async () => {
   if (jokes.isLatest()) {
       await fetchNewJoke()
   } else {
        jokes = jokes.next()
        jokes.saveToCookies()
   }
}

const handlePrev = () => {
    if (jokes.history.index <= 1) return

   jokes = jokes.prev();
    jokes.saveToCookies() 
}

const handleToggleDarkJokes = () => {
    jokes = jokes.toggleDarkJokes()
}

const handleClearHistory = () => {
    jokes = jokes.clearHistory()
}

const handleCategoryChange = (index) => {
    jokes = jokes.toggleCategory(index)
}

</script>

<main>
    <div class="jokeContainer">
        <div class="jokeDisplayBox">
            {#if currentJoke}
                <p>{jokes.format(currentJoke)}</p>
            {/if}
        </div>

        <div class="jokeInfoBox">
            {#if currentJoke}
                <span>Your joke index is: {jokes.history.index} / {jokes.history.entries.length}</span>
                <p>This joke is of category: {currentJoke.category}</p>
            {:else}
                <p>Loading...</p>
            {/if}

        </div>



        <div class="buttons">
            <button on:click={handleNext}>Display next joke!</button>
            <button on:click={handlePrev}>Display earlier joke!</button>
            <button on:click={handleToggleDarkJokes}>Receive dark jokes. <span>{jokes.showDarkJokes}</span></button>
            <button on:click={handleClearHistory}>Clears history use with caution!</button>
        </div>

        <div class="categories">
            <h3>Categories:</h3>
            {#each jokes.categories as category, i}
                <span><input type="checkbox" checked={category.enabled} on:change={() => handleCategoryChange(i)}><span>{category.name}</span></span>
            {/each}
        </div>
    </div>
</main>

<style>
.jokeDisplayBox {
    background-color: gray;
}

.categories {
    display: inline-flex;
    align-items: center;
    gap: 15px;
    justify-content: center;
}
</style>
