<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        buttonCaption: String,
        instructions: Array<String>,
    },
    data: () => {
        return {
            targetImage: '',
            instructionLines: [] as Array<String>,
        };
    },
    emits: ['found'],
    computed: {
        hasInstruction() {
            return !!this.instructionLines?.length;
        },
        hasNextTargetButton() {
            return !!this.buttonCaption;
        },
        hasTargetImage() {
            return !!this.targetImage;
        },
    },
    methods: {
        onNextTarget() {
            this.$emit('found');
        },
        parseInstructions(text?: Array<String>) {
            let targetImage = ''
            let instructionLines = [];

            if (text instanceof Array) {
                instructionLines = [ ...text ];

                // try to detect if this is a target name in te second line
                // and load an image if this is so
                if (text.length == 2) {
                    const line2 = Array.from(text[1])
                    if (line2.every((letter: string) => letter === ' ' || (letter >= 'A' && letter <= 'Z'))) {
                        let filename = line2.filter(letter => letter != ' ').join('').toLowerCase();
                        targetImage = `./images/${filename}.webp`;
                    }
                }
            }
            else if (typeof text === 'string') {
                instructionLines = [ text ]
            }
            else {
                instructionLines = [ `${text}` ]
            }

            return {
                targetImage,
                instructionLines,
            };
        }
    },
    watch: {
        instructions(text: Array<String>) {
            const data = this.parseInstructions(this.instructions);
            this.targetImage = data.targetImage;
            this.instructionLines = data.instructionLines;
        }
    },
    mounted() {
        const data = this.parseInstructions(this.instructions);
        this.targetImage = data.targetImage;
        this.instructionLines = data.instructionLines;
    }
})
</script>

<template lang="pug">
.hero
    button.next-target(
        v-show="hasNextTargetButton"
        @click="onNextTarget") {{ buttonCaption }}
    .instruction-container(v-show="hasInstruction")
        .instruction(v-for="inst in instructionLines") {{ inst }}
        img.target(v-if="hasTargetImage" :src="targetImage")
</template>

<style scoped>
.hero {
    position: fixed;
    display: flex;
    flex-direction: column;

    top: 9em;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.instruction-container {
    color: chartreuse;
    padding: 2em 1em;
    text-align: center;
    align-self: center;
}
@media (prefers-color-scheme: light) {
    .instruction-container {
        color: darkslategray;
        font-weight: bold;
    }
}
.instruction {
    font-size: 1.75rem;
}
.instruction:last-of-type {
    font-weight: bold;
}

button.next-target {
    font-size: 1.75rem;
    min-height: 40vh;
    min-width: 40vh;
    margin: 0 2em;
    border-radius: 0.5em;
}

img.target {
    margin-top: 2rem;
    height: 40vh;
}

@media screen and (min-width: 1024px) {
    .hero {
        top: 5em;
        flex-direction: row;
    }
    button.next-target {
        font-size: 2.75rem;
        padding: inherit;
        min-width: 50vw;
        margin: 0.5em 1em;
    }
}

</style>
