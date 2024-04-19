import Phaser from "phaser";
import Manual from "../objects/manual";

export default class Level1Scene extends Phaser.Scene {
    private stateText: Phaser.GameObjects.Text;
    private inputField: HTMLInputElement;
    private inputContainer: Phaser.GameObjects.Container;
    private timer: Phaser.GameObjects.Text;
    private lvl2: boolean;
    private lvl3: boolean;
    private lvl4: boolean;
    private username: string;
    private lvl5: boolean;
    private objectiveCompleted: boolean = false;
    private lastText: string[] = [""];
    private manual: Manual;
    private lastPosition: number = -1;

    constructor() {
        super({ key: "Level01" });
    }

    init(data: {
        username: string;

        lvl1: boolean;

        lvl2: boolean;

        lvl3: boolean;

        lvl4: boolean;

        lvl5: boolean;
    }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
        this.username = data.username;
        this.lvl5 = data.lvl5;
    }
    preload() {
        this.load.image("ClosedBook", "../assets/ClosedBook.png");
        this.load.image("HoveredBook", "../assets/HoveredBook.png");
        this.load.image("OpenBook", "../assets/OpenBook.png");
    }

    create() {
        this.objectiveCompleted = false;
        this.add.rectangle(640, 360, 1280, 720, 0x000);

        this.add.image(640, 100, "prompt").setDisplaySize(560, 110);
        this.add.image(200, 100, "alfredicon").setDisplaySize(130, 130);
        this.add.image(1050, 100, "pin").setDisplaySize(30, 40);
        this.manual = new Manual(this, 50, 100, "Initial manual text here.");

        let ding = this.sound.add("ding", { loop: false });
        let lsDing = this.sound.add("lsDing", { loop: false });
        let cdDing = this.sound.add("cdDing", { loop: false });
        let cdBackDing = this.sound.add("cdBackDing", { loop: false });
        let manDing = this.sound.add("manDing", { loop: false });

        this.inputContainer = this.add.container(360, 520);

        const maskGraphics = this.make.graphics();
        maskGraphics.fillRect(300, 185, 1080, 500);
        const mask = new Phaser.Display.Masks.GeometryMask(this, maskGraphics);

        this.inputContainer.setMask(mask);

        this.addTextToContainer("Alfred: Welcome back " + this.username + "!");

        let state: string = "home";

        const lsMap = new Map<string, string>();
        const cdMap = new Map<string, string[]>();
        const cdBack = new Map<string, string>();
        const manMap = new Map<string, string>();
        const rmMap = new Map<string, string[]>(); // Map to track removable files

        lsMap.set("home", "dir_break_room dir_closet dir_control_room");
        lsMap.set(
            "break_room",
            "dir_suitcase file_vending_machine file_chair file_table"
        );
        lsMap.set("closet", "dir_cardboard_box file_wires file_hazmat_suit");
        lsMap.set(
            "control_room",
            "file_surveillance_camera file_monitor file_apple_juice"
        );
        lsMap.set(
            "suitcase",
            "file_namuhs_glasses file_batteries file_papers file_apple"
        );
        lsMap.set("cardboard_box", "file_papers");

        cdMap.set("home", ["break_room", "closet", "control_room"]);
        cdMap.set("break_room", ["suitcase"]);
        cdMap.set("closet", ["cardboard_box"]);

        cdBack.set("break_room", "home");
        cdBack.set("closet", "home");
        cdBack.set("control_room", "home");
        cdBack.set("suitcase", "break_room");
        cdBack.set("cardboard_box", "closet");

        rmMap.set("control_room", ["surveillance_camera"]);

        manMap.set(
            "ls",
            "Alfred: Remember, the 'ls' command\nis useful for viewing your surroundings."
        );
        manMap.set(
            "rm",
            "Alfred: Remember, the 'rm' command\nneutralizes enemy files."
        );
        manMap.set(
            "cd",
            "Alfred: Do recall, the 'cd' command\npermits you to navigate through rooms and items."
        );
        manMap.set(
            "alfred",
            "Alfred: Try using the 'cd' command to traverse through\ndifferent areas. Then use 'rm' to remove critical files."
        );

        // Add text input field
        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.style.position = "absolute";
        this.inputField.style.width = "600px";
        this.inputField.style.height = "40px";
        this.inputField.style.fontSize = "20px";
        this.inputField.style.top = "80%";
        this.inputField.style.left = "50%";
        this.inputField.style.backgroundColor = "#000"; // Change background color to white
        this.inputField.style.color = "#fff"; // Change text color to black
        this.inputField.placeholder = ">$"; // Placeholder text
        this.inputField.style.border = "2px solid gold";

        this.inputField.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(this.inputField);

        this.add.text(
            410,
            59,
            "Enter the 'control_room' and remove the \n'surveillance_camera' so you can proceed\ninto the next area. Namuh has security\nroaming the area so time is of the essence.",
            {
                color: "#fff",
                fontSize: "17px",
                fontFamily: "Monospace",
            }
        );

        this.input.keyboard?.removeCapture(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                const newText = this.inputField.value;
                this.lastText.push(newText.trim());

                if (newText.trim() !== "") {
                    if (newText.trim() == "ls") {
                        lsDing.play();
                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                newText
                        );
                        this.addLsToContainer(lsMap.get(state) as string);
                    } else if (newText.substring(0, 3) == "cd ") {
                        let cdInput: string = newText.substring(
                            3,
                            newText.length
                        );
                        // CD .. FUNCTIONALITY BELOW
                        const backState = cdBack.get(state);
                        const cdState = cdMap.get(state);
                        if (backState !== undefined && cdInput == "..") {
                            cdBackDing.play();

                            state = backState;
                            this.stateText.setText(state);
                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                        }
                        // CD FUNCTIONALITY BELOW
                        else if (
                            cdState !== undefined &&
                            cdMap.get(state)?.includes(cdInput)
                        ) {
                            cdDing.play();

                            state = newText.substring(3);
                            this.stateText.setText(state);
                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                        }
                        // CD DIRECTORY NOT FOUND BELOW
                        else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.addTextToContainer("Directory not found");
                        }
                        // MAN INPUT BELOW
                    } else if (newText.substring(0, 4) == "man ") {
                        let manInput: string = newText.substring(4);

                        const manState = manMap.get(manInput);
                        if (manState !== undefined) {
                            manDing.play();
                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.addTextToContainer(
                                manMap.get(manInput) as string
                            );
                        } else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.addTextToContainer(
                                "Command '" + manInput + "' not found"
                            );
                        }
                    } else if (newText.substring(0, 3) == "rm ") {
                        let rmInput: string = newText.substring(3);
                        if (rmMap.get(state)?.includes(rmInput)) {
                            // Remove the file from the listing and update the map
                            let files = lsMap.get(state) || "";
                            files = files
                                .replace(rmInput, "")
                                .trim()
                                .replace(/\s{2,}/g, " "); // Remove the file and extra spaces
                            lsMap.set(state, files);

                            // Optionally, remove the file from the rmMap if you want to prevent further references
                            // rmMap.get(state)?.splice(rmMap.get(state)?.indexOf(rmInput), 1);

                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.addTextToContainer(
                                "File '" + rmInput + "' removed successfully."
                            );

                            // Check if the level's objective is achieved, e.g., if all required files are removed
                            if (
                                state === "control_room" &&
                                !files.includes("surveillance_camera")
                            ) {
                                this.objectiveCompleted = true;
                                // Level completion logic here
                                this.addTextToContainer(
                                    "\nObjective complete: Classified file removed. \nGood work, " +
                                        this.username +
                                        "!"
                                );
                                this.time.delayedCall(
                                    3000,
                                    this.loadLevel,
                                    [],
                                    this
                                );
                            }
                        } else {
                            ding.play();

                            this.inputField.value = ""; // Empty the input field
                            this.addTextToContainer(
                                this.username
                                    .toLowerCase()
                                    .replace(/\s+/g, "_") +
                                    ": " +
                                    newText
                            );
                            this.addTextToContainer(
                                "File '" +
                                    rmInput +
                                    "' cannot be found or removed."
                            );
                        }
                    }
                    // NONSENSE INPUT BELOW
                    else {
                        ding.play();
                        this.inputField.value = ""; // Empty the input field
                        this.addTextToContainer(
                            this.username.toLowerCase().replace(/\s+/g, "_") +
                                ": " +
                                newText
                        );
                        this.addTextToContainer(
                            "Command '" + newText + "' not found"
                        );
                    }
                }
            }

            if (event.key === "ArrowUp") {
                let index = this.lastText.length + this.lastPosition;
                if (index > 0) {
                    this.inputField.value = this.lastText[index];
                    this.lastPosition -= 1;
                }
            }
            if (event.key === "ArrowDown") {
                let index = this.lastText.length + this.lastPosition;
                if (index < this.lastText.length - 2) {
                    this.inputField.value = this.lastText[index + 2];
                    this.lastPosition += 1;
                }
            }
        });

        let time = 60;
        let lastUpdateTime = Date.now();

        this.timer = this.add.text(75, 655, time.toFixed(2), {
            fontSize: "50px",
            color: "red",
        });

        const updateTimer = () => {
            if (!this.objectiveCompleted) {
                const currentTime = Date.now();
                const elapsedTime = currentTime - lastUpdateTime;

                time -= elapsedTime / 1000; // Adjust time based on elapsed time in seconds
                lastUpdateTime = currentTime; // Update the last update time

                if (time > 0) {
                    this.timer.setText(time.toFixed(2)); // Update the timer text
                    this.time.delayedCall(10, updateTimer);
                } else {
                    this.timer.setText("0.00");
                    this.scene.start("SecurityBreachScene", {
                        username: this.username,
                        lvl2: this.lvl2,
                        lvl3: this.lvl3,
                        lvl4: this.lvl4,
                    });
                }
            }
        };

        updateTimer();

        this.stateText = this.add.text(1075, 95, state, {
            fontSize: "24px",
            color: "#fff",
        });
        this.events.on("shutdown", this.removeInputField, this);
    }
    removeInputField() {
        if (this.inputField.parentElement) {
            this.inputField.parentElement.removeChild(this.inputField);
        }
    }
    update() {}

    addLsToContainer(text: string) {
        const words = text.split(" ");

        const numNewlines = words.length;

        this.inputContainer.y -= numNewlines * 24.7;

        for (let word of words) {
            if (word.substring(0, 5) === "file_") {
                let newWord = word.substring(5);
                const newText = this.add.text(0, 0, newWord, {
                    fontSize: "24px",
                    color: "#77C3EC",
                });
                this.inputContainer.add(newText);
            } else if (word.substring(0, 4) === "dir_") {
                let newWord = word.substring(4);
                const newText = this.add.text(0, 0, newWord, {
                    fontSize: "24px",
                    color: "#86DC3D",
                });
                this.inputContainer.add(newText);
            } else {
                const newText = this.add.text(0, 0, word, {
                    fontSize: "24px",
                    color: "#fff",
                });
                this.inputContainer.add(newText);
            }

            this.repositionTextObjects();
        }
    }

    addTextToContainer(text: string) {
        const newText = this.add.text(0, 0, text, {
            fontSize: "24px",
            color: "#fff",
        });

        const numNewlines = (text.match(/\n/g) || []).length + 1;

        // Adjust y position based on the number of newline characters
        this.inputContainer.y -= numNewlines * 24.7;

        if (text.includes("Alfred: ")) {
            newText.setColor("gold");
        }
        if (text.includes("Objective complete: ")) {
            newText.setColor("lime");
        }

        // Add the new text object to the container
        this.inputContainer.add(newText);

        // Reposition text objects vertically within the container
        this.repositionTextObjects();
    }

    repositionTextObjects() {
        let yPos = 0;

        // Loop through all text objects in the container and position them vertically
        this.inputContainer.iterate((child: Phaser.GameObjects.GameObject) => {
            if (child instanceof Phaser.GameObjects.Text) {
                child.y = yPos;
                yPos += child.height;
            }
        });
    }

    loadLevel() {
        this.removeInputField();
        this.scene.start("LevelSelect", {
            username: this.username,
            lvl2: true,
            lvl3: this.lvl3,
            lvl4: this.lvl4,
            lvl5: this.lvl5,
        });
    }
}
