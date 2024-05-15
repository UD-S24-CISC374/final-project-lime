import Phaser from "phaser";

export default class SecurityBreachScene extends Phaser.Scene {
    private text: Phaser.GameObjects.Text;
    private backgroundColor: string;
    private textColor: string;
    private timer: Phaser.Time.TimerEvent;
    private graphics: Phaser.GameObjects.Graphics;
    private menuMusic: Phaser.Sound.BaseSound | undefined;
    private username: string;
    private lvl2: boolean;
    private lvl3: boolean;
    private lvl4: boolean;
    private lvl5: boolean;
    private time1: number;
    private time2: number;
    private time3: number;
    private time4: number;
    private time5: number;

    constructor() {
        super({ key: "SecurityBreachScene" });
    }
    init(data: {
        username: string;
        lvl1: boolean;
        lvl2: boolean;
        lvl3: boolean;
        lvl4: boolean;
        time1: number;
        time2: number;
        time3: number;
        time4: number;
        time5: number;
    }) {
        this.lvl2 = data.lvl2;
        this.lvl3 = data.lvl3;
        this.lvl4 = data.lvl4;
        this.time1 = data.time1;
        this.time2 = data.time2;
        this.time3 = data.time3;
        this.time4 = data.time4;
        this.time5 = data.time5;
        this.username = data.username;
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
            this.menuMusic = this.sound.add("menuMusic", {
                loop: true,
            });
            this.menuMusic.play();
            this.scene.start("LevelSelect"),
                {
                    username: this.username,
                    lvl2: this.lvl2,
                    lvl3: this.lvl3,
                    lvl4: this.lvl4,
                    lvl5: this.lvl5,
                    time1: this.time1,
                    time2: this.time2,
                    time3: this.time3,
                    time4: this.time4,
                    time5: this.time5,
                };
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
