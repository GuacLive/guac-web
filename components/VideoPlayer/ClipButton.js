import videojs from 'video.js';

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');

export class ClipButton extends Button {
    constructor(player, options){
        super(player, options);
        this.controlText_ = player.localize('Clip');
    }
    buildCSSClass() {
      // vjs-icon-cog can be removed when the settings menu is integrated in video.js
      return `vjs-clip-button ${super.buildCSSClass()}`;
    }
    handleClick(){
      this.player().trigger('clip');
    }
};
Component.registerComponent('ClipButton', ClipButton);
export default ClipButton;