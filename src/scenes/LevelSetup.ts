import LevelTemplate from "./LevelTemplate";

export default class Level1Test extends LevelTemplate {
    constructor() {
        super("Level1Test");
    }

    preload() {
        super.preload(); // Call the preload method from LevelTemplate
        // Additional assets for Level 1
    }
    init(data: {
        username: string;
        lvl1: boolean;
        lvl2: boolean;
        lvl3: boolean;
        lvl4: boolean;
        lvl5: boolean;
    }) {
        super.init(data); // Call the init method from LevelTemplate
    }

    create() {
        this.setManualText("Level 1 manual text");
        this.setPromptText("Level 1 prompt text");
        this.setTimeLimit(120); // Set the time limit for the level
        super.create(); // Initialize the common features from LevelTemplate
    }

    update() {
        // You can also override update if needed, and call super.update() if LevelTemplate has update logic
    }
}
