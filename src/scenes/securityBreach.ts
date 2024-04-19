import Phaser from "phaser";

export default class SecurityBreachScene extends Phaser.Scene {
    private text: Phaser.GameObjects.Text;
    private backgroundColor: string;
    private textColor: string;
    private timer: Phaser.Time.TimerEvent;
    private graphics: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: "SecurityBreachScene" });
    }

    create() {
        // Set initial colors
        this.backgroundColor = "#FF0000"; // Start with red background
        this.textColor = "#000000"; // black text
        this.cameras.main.setBackgroundColor(this.backgroundColor); // Set initial background color

        // Create text
        this.text = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "SECURITY BREACH DETECTED",
                {
                    font: "bold 70px arial",
                    color: this.textColor,
                }
            )
            .setOrigin(0.5);

        // Create an unfilled rectangle as a border around the text
        this.graphics = this.add.graphics();
        this.updateGraphics(this.backgroundColor);

        // Timer for color change
        this.timer = this.time.addEvent({
            delay: 500, // changes color every third of a second
            callback: this.toggleColors,
            callbackScope: this,
            loop: true,
        });

        // Scene transition after 3 seconds
        this.time.delayedCall(3000, () => {
            this.scene.start("LevelSelect");
        });
    }

    toggleColors() {
        this.backgroundColor =
            this.backgroundColor === "#FF0000" ? "#000000" : "#FF0000";
        this.textColor = this.textColor === "#FF0000" ? "#000000" : "#FF0000";
        this.cameras.main.setBackgroundColor(this.backgroundColor);
        this.text.setColor(this.textColor);
        this.updateGraphics(this.backgroundColor);
    }

    updateGraphics(backgroundColor: string) {
        // Clear previous graphics first
        this.graphics.clear();

        // Update border based on background color for better visibility
        const borderColor = backgroundColor === "#000000" ? 0xff0000 : 0x000000;
        this.graphics.lineStyle(4, borderColor, 1);

        const bounds = this.text.getBounds();
        this.graphics.strokeRect(
            bounds.x - 10,
            bounds.y - 10,
            bounds.width + 20,
            bounds.height + 20
        );
    }
}
