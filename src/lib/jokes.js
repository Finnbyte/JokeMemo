export class Jokes {
    categories = [
        { name: "Programming", enabled: true }, 
        { name: "Misc.", enabled: true },
        { name: "Pun", enabled: true },
        { name: "Spooky", enabled: true },
        { name: "Christmas", enabled: true },
        { name: "Dark", enabled: false }
    ]
    history = { entries: [], index: 0 };

    /* Cookies */
    saveToCookies() {
        localStorage.setItem("history", JSON.stringify(this.history, null, null));
        localStorage.setItem("categories", JSON.stringify(this.categories, null, null));
    }

    loadFromCookies() {
        /* History */
        if (localStorage.getItem("history")) {
            const storagedHistory = JSON.parse(localStorage.getItem("history"));
            this.history = storagedHistory;
        } 

        /* Categories */
        if (localStorage.getItem("categories")) {
            const storagedCategories = JSON.parse(localStorage.getItem("categories"));
            this.categories = storagedCategories;

            /* Toggle checkboxes which have their values stored */
        }
        return this;
    }

    clearCookies() {
        localStorage.removeItem("history");
        localStorage.removeItem("categories");
    }

    /* Browsing history */
    isLatest() {
        if (this.history.index < this.history.entries.length) return false
        return true;
    }

    prev() {
        this.history.index -= 1;
        return this

    }
    next() {
        this.history.index += 1;
        return this
    }

    /* Modifying history */
    appendToHistory(newJoke) {
        this.history.entries.push(newJoke);
        return this
    }

    clearHistory() {
        this.history.entries = [""];
        this.history.index = 0;
        this.clearCookies();
        return this
    }

    /* Modifying categories */
    toggleCategory(index) {
        this.categories[index].enabled = !this.categories[index].enabled
        return this
    }

    format(currentJoke) {
        if (typeof currentJoke === "undefined") return

        if (currentJoke.type === "single") return `${currentJoke.joke}`
        if (currentJoke.type === "twopart") return `${currentJoke.setup}\n\n${currentJoke.delivery}`
    }
}
