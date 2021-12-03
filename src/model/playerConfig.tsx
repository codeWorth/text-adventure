enum ConfigStage {
    NAME, WELCOME, DONE
};

class PlayerConfig {
    name: string = "";
    stage: ConfigStage = ConfigStage.NAME;

    promptMessage(): string {
        if (this.stage === ConfigStage.NAME) {
            return "What will be your name?";
        } else if (this.stage === ConfigStage.WELCOME) {
            return `Welcome ${this.name}. Press Enter to begin.`;
        } else {
            return "";
        }
    }

    consumeInput(message: string) {
        if (this.stage === ConfigStage.NAME) {
            this.name = message;
            if (this.name.length > 0) this.stage = ConfigStage.WELCOME;
        } else if (this.stage === ConfigStage.WELCOME) {
            this.stage = ConfigStage.DONE;
        }
    }

    isFinished() {
        return this.stage === ConfigStage.DONE;
    }
};

export default PlayerConfig;