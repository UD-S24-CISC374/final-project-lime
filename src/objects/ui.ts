import Phaser from "phaser";
import Manual from "./manual";

export default class UIElements extends Phaser.GameObjects.Container {
    scene: Phaser.Scene;
    username: string;
    promptImage: Phaser.GameObjects.Image;
    alfredImage: Phaser.GameObjects.Image;
    pinImage: Phaser.GameObjects.Image;
    manual: Manual;
    inputField: HTMLInputElement;
    constructor(scene: Phaser.Scene, x: number, y: number, username: string) {
        super(scene, x, y);
        this.scene = scene;
        this.username = username;

        this.initUI();
    }

    initUI() {
        // Load Images and Text dynamically
        this.promptImage = this.scene.add
            .image(0, -260, "prompt")
            .setDisplaySize(560, 110);
        this.alfredImage = this.scene.add
            .image(-440, -260, "alfredicon")
            .setDisplaySize(130, 130);
        this.pinImage = this.scene.add
            .image(410, -260, "pin")
            .setDisplaySize(30, 40);

        // Manual object instantiation
        this.manual = new Manual(
            this.scene,
            -590,
            -260,
            "Initial manual text here."
        );

        // Add all the elements to the container
        this.add([
            this.promptImage,
            this.alfredImage,
            this.pinImage,
            this.manual,
        ]);

        // Add and configure the text input field
        this.createInputField();
    }

    createInputField() {
        // Ensure the previous input field is removed if it exists
        if (this.inputField.parentElement) {
            this.inputField.parentElement.removeChild(this.inputField);
        }

        // Create new input field
        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.style.position = "absolute";
        this.inputField.style.width = "600px";
        this.inputField.style.height = "40px";
        this.inputField.style.fontSize = "20px";
        this.inputField.style.top = "50%";
        this.inputField.style.left = "50%";
        this.inputField.style.backgroundColor = "#000";
        this.inputField.style.color = "#fff";
        this.inputField.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(this.inputField);

        // Optional: Add event listeners specific to the input field
        this.inputField.addEventListener(
            "keydown",
            this.handleInput.bind(this)
        );
    }

    handleInput(event: KeyboardEvent) {
        if (event.key === "Enter") {
            // Logic for what happens when the user presses Enter
            console.log(this.inputField.value);
            this.inputField.value = ""; // Reset the input field after enter
        }
    }

    updateManualText(text: string) {
        this.manual.setManualText(text);
    }

    removeInputField() {
        if (this.inputField.parentElement) {
            this.inputField.parentElement.removeChild(this.inputField);
        }
    }

    // Add other necessary methods to update or interact with UI components
}
