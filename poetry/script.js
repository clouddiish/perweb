class Model {
    constructor() {
        this.poems = [];
        this.fetchPoems();

        this.yearsChecked = new Set([]);
        this.collectionsChecked = new Set([]);
    }

    async fetchPoems() {
        const response = await fetch("../data/poems.json");
        let data = await response.json();
        this.poems = data;
    }

}

class View {
    constructor() {
        this.poemsDiv = document.getElementById("poemsDiv");

        this.filterForm = document.getElementById("filterForm");

        // this.formYear = document.getElementById("formYear")
        this.y2024 = document.getElementById("2024");
        this.y2023 = document.getElementById("2023");
        this.y2022 = document.getElementById("2022");
        this.y2021 = document.getElementById("2021");
        this.y2020 = document.getElementById("2020");

        // this.formCollection = document.getElementById("formCollection");
        this.rottenBrain = document.getElementById("rottenBrain");
        this.humanity = document.getElementById("humanity");
        this.bittersweet = document.getElementById("bittersweet");
        this.ldofSummer = document.getElementById("ldofSummer");

    }

    clearPoemsDiv() {
        this.poemsDiv.innerHTML = '<h2 class="mb-5">poems</h2>'
    }

    clearCheckboxes() {
        this.y2024.checked = false;
        this.y2023.checked = false;
        this.y2022.checked = false;
        this.y2021.checked = false;
        this.y2020.checked = false;
        this.rottenBrain.checked = false;
        this.humanity.checked = false;
        this.bittersweet.checked = false;
        this.ldofSummer.checked = false;
    }

    addPoem(poem) {
        let div = document.createElement("div");
        div.classList.add("mb-5");

        let title = document.createElement("h3");
        title.textContent = poem.title;
        div.appendChild(title);

        let meta = document.createElement("p");
        meta.textContent = `${poem.year} | ${poem.collection}`;
        meta.classList.add("meta");
        div.appendChild(meta);

        for (let i = 0; i < poem.paragraphs.length; i++) {
            let p = document.createElement("p");
            p.innerHTML = poem.paragraphs[i];
            div.appendChild(p);
        }

        this.poemsDiv.appendChild(div);
    }

    bindFilterPoems(handler) {
        let ystate;
        let yvalue;
        let cstate;
        let cvalue;

        this.filterForm.addEventListener("input", event => {

            if (event.target.className == "form-check-input year") {
                ystate = event.target.checked;
                yvalue = Number(event.target.value);
            }

            if (event.target.className == "form-check-input collection") {
                cstate = event.target.checked;
                cvalue = event.target.value;
            }

            handler(ystate, yvalue, cstate, cvalue);
        })

    }

}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindFilterPoems(this.handleFilterPoems);
    }

    getAllPoems() {
        return this.model.poems;
    }

    getPoemsByYear(year) {
        let filteredPoems = [];
        for (let i = 0; i < this.model.poems.length; i++) {
            if (this.model.poems[i].year == year) filteredPoems.push(this.model.poems[i]);
        }
        return filteredPoems;
    }

    getPoemsByCollection(collection) {
        let filteredPoems = [];
        for (let i = 0; i < this.model.poems.length; i++) {
            if (this.model.poems[i].collection == collection) filteredPoems.push(this.model.poems[i]);
        }
        return filteredPoems;
    }

    getPoemById(id) {
        return this.model.poems[id];
    }

    displayPoems(poems) {
        this.view.clearPoemsDiv();
        for (let i = poems.length - 1; i >= 0; i--) {
            this.view.addPoem(poems[i]);
        }
    }

    async waitAndDisplayAllPoems() {
        await this.model.fetchPoems();
        this.displayPoems(this.model.poems);
    }

    handleFilterPoems = (ystate, yvalue, cstate, cvalue) => {

        if (ystate == true) {
            this.model.yearsChecked.add(yvalue);
        }

        if (ystate == false) {
            this.model.yearsChecked.delete(yvalue);
        }

        if (cstate == true) {
            this.model.collectionsChecked.add(cvalue);
        }

        if (cstate == false) {
            this.model.collectionsChecked.delete(cvalue);
        }

        if (this.model.yearsChecked.size == 0 && this.model.collectionsChecked.size == 0) {
            this.displayPoems(this.model.poems);

        } else if (this.model.yearsChecked.size != 0 && this.model.collectionsChecked.size == 0) {
            this.displayPoems(this.model.poems.filter(poem => this.model.yearsChecked.has(poem.year)));

        } else if (this.model.yearsChecked.size == 0 && this.model.collectionsChecked.size != 0) {
            this.displayPoems(this.model.poems.filter(poem => this.model.collectionsChecked.has(poem.collection)));

        } else {
            this.displayPoems(this.model.poems.filter(poem =>
                (this.model.yearsChecked.has(poem.year) && this.model.collectionsChecked.has(poem.collection))
            ));

        }
    }

}

const app = new Controller(new Model(), new View());

window.onload = () => {
    app.waitAndDisplayAllPoems();
    app.view.clearCheckboxes();
};
