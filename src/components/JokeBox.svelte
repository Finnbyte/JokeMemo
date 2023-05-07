<script>
// Icons 
import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte';
import FaChevronRight from 'svelte-icons/fa/FaChevronRight.svelte';

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

// URL depends on enabled categories
$: url = `https://v2.jokeapi.dev/joke/${enabledCategories}`

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
    jokes.saveToCookies()
}

</script>

<main>
    <div class="jokeContainer">
        <div class="jokeDisplayBox">
            {#if currentJoke}
                <div class="chevronContainer" on:click={handlePrev}>
                </div>
                <span class="chevron"><FaChevronLeft /></span>

                <span>{jokes.format(currentJoke)}</span>

                <div class="chevronContainer" on:click={handleNext}>
                    <span class="chevron"><FaChevronRight/></span>
                </div>
            {/if}
        </div>

        <div class="jokeBoxPanel">
            <div class="jokeInfoBox">
                {#if currentJoke}
                    <span>Your joke index is: {jokes.history.index} / {jokes.history.entries.length}</span><br/>
                    <span>This joke is of category: {currentJoke.category}</span>
                {:else}
                    <p>Loading...</p>
                {/if}

            </div>

            <div class="jokeBoxButtons">
                <button on:click={handleClearHistory}>Clears history use with caution!</button>
            </div>
        </div>

        <div class="jokeBoxCategories">
            <h3>Categories:</h3>
            {#each jokes.categories as category, i}
                <span><input type="checkbox" checked={category.enabled} on:change={() => handleCategoryChange(i)}><span>{category.name}</span></span>
            {/each}
        </div>
    </div>
</main>

<style>
.jokeDisplayBox {
    display: flex;
    text-align: center;
    align-items: center;
    border-radius: 25px;
    justify-content: space-between;
    padding: 1.2% 0 1.2% 0;
    height: 30vh;
    border: 2px solid black;
    background-color: rgba(255, 100, 100, 0.1);

}

.jokeDisplayBox span:hover {
    cursor: pointer;
    user-select: none;
    pointer-events: auto;
}

.jokeBoxPanel {
    padding-top: 1vh;
    display: flex;
}

.jokeBoxPanel .jokeBoxButtons {
    margin-left: auto
}

.jokeBoxCategories {
    display: inline-flex;
    align-items: center;
    gap: 15px;
    justify-content: center;
}

.chevronContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor:pointer;
    padding: 0 1.2% 0 1.2%;
    z-index: 999;
    height: 100%;
    width: 20%;
}

.chevron {
    z-index: 999;
    user-select: none;
    cursor: none;
    width: 32px;
    height: 32px
}
</style>
