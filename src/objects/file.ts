// // export class Folder {
// //     name: string;
// //     type: string;
// //     children: Folder[];
// //     color: string;
// //     constructor(name: string, type: string, children: Folder[] = []) {
// //         this.name = name;
// //         this.type = type;
// //         if (this.type === "folder") {
// //             this.children = children;
// //             this.color = "blue";
// //         }
// //         else {
// //             this.color = "green";
// //             this.children = [];

// //         }

// //      }

// //     display() {
// //         print(this.name(color == color)
// //     }
// // }

// export default class BaseScene extends Phaser.Scene{
//     alfredLogo: Phaser.GameObjects.Image;
//     manual: Manual;
//     promptBox: PromptBox;
//     inputBox: InputBox;
//     commands: Command[];
//     pin: Pin;

//     constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
//         super(config);
//     }

//     preload() {
//         this.load.image('logo', 'assets/logo.png');
//     }

//     create() {
//         //add alfred logo
//         //add manual
//         //add prompt box
//         //add input box
//         //add commands
//         //add pin
//     }
//     setPromptText(){
//         //set prompt text
//     }
//     setManualText(){
//         //set manual text
//     }
//     setCommands(){
//         //set commands
//     }

// }

// export default class Level01 extends BaseScene{
//     constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
//         super(config);
//     }
//     create() {
//         super.create();
//         this.setCommands(list of commands)
//         this.setPromptText("prompt text")
//         this.setManualText("manual text")
//         //add level 01 specific stuff
//     }
// }

// export default class Command {
//     command: string;
//     description: string;
//     constructor(command: string, description: string){
//         this.command = command;
//         this.description = description;
//     }
// }
