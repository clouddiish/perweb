class Model {
    constructor() {
        fetch("./data.json")
            .then((res) => res.json())
            .then((data) => {
                this.poems = data;
            });
    }
}

class View {
    constructor() { }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view
    }
}

const app = new Controller(new Model(), new View())