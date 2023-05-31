<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import type { Ref } from 'vue'
import type { IRequest } from './common'

import { Response, ResponseType, RequestType } from './common'

import Questionnaire from './components/Questionnaire.vue'
import Likert from './components/Likert.vue'
import Connection from './components/Connection.vue'

const connectionRef = ref()
const instruction: Ref<string[]> = ref( [] );
const nextTargetButtonCaption = ref( '' );
const debugMessages: Ref<string[]> = ref( [] );
const isQuestionnaireVisible = ref( false );
const targetImage = ref( '' );
const score = ref( '0' );

const hasInstruction = computed( () => !!instruction.value.length && !isQuestionnaireVisible.value );
const hasNextTargetButton = computed( () => !!nextTargetButtonCaption.value && !isQuestionnaireVisible.value );
const hasDebugMessages = computed( () => !!debugMessages.value.length );
const hasTargetImage = computed( () => !!targetImage.value );

function onConnected() {
    instruction.value = [];
    debugMessages.value = [];
    isQuestionnaireVisible.value = false;
    nextTargetButtonCaption.value = '';
    score.value = '0'
}

function onRequest(request: IRequest) {
    if (request.target === RequestType.button) {
        onRequestButton(request.cmd, request.param);
    }
    else if (request.target === RequestType.questionnaire) {
        isQuestionnaireVisible.value = request.cmd === 'show';
    }
    else if (request.target === RequestType.message) {
        onRequestMessage(request.cmd, request.param);
    }
    else if (request.target === RequestType.score) {
        score.value = request.cmd;
    }
    else {
        debugMessages.value.push( `UNKNOWN REQUEST ${request.target} (${request.cmd}, ${request.param})` );
    }
}

function onRequestButton(cmd: string, caption?: string) {
    if (cmd == 'show') {
        nextTargetButtonCaption.value = caption || 'Next target'
    }
    else {
        nextTargetButtonCaption.value = ''
    }
}

function onRequestMessage(cmd: string, text: string[]) {
    targetImage.value = ''
    
    if (cmd == 'show') {
        if (text instanceof Array) {
            instruction.value = text

            // try to detect if this is a target name in te second line
            // and load an image if this is so
            if (text.length == 2) {
                const line2 = Array.from(text[1])
                if (line2.every((letter: string) => letter === ' ' || (letter >= 'A' && letter <= 'Z'))) {
                    let filename = line2.filter(letter => letter != ' ').join('').toLowerCase();
                    targetImage.value = `./images/${filename}.webp`;
                    console.log(targetImage.value)
                }
            }
        }
        else if (typeof text == 'string') {
            instruction.value = [ text ]
        }
        else {
            instruction.value = [ `${text}` ]
        }
    }
    else {
        instruction.value = []
    }
}

function onQuestionnaireAnswer( e: number ) {
    isQuestionnaireVisible.value = false;
    connectionRef.value.send( JSON.stringify( new Response(ResponseType.questionnaire, e ) ) );
}

function onNextTarget() {
    nextTargetButtonCaption.value = '';
    connectionRef.value.send( JSON.stringify( new Response(ResponseType.target, 'random' ) ) );
}

onMounted(() => {
    window.addEventListener( "error" , (e) => { debugMessages.value.push( `ERROR: ${e.message}` )})

    window.addEventListener('keydown', (e) => {
        if (e.key == 'q') {
            const req = {
                target: RequestType.questionnaire,
                cmd: "show",
                param: null,
            } as IRequest;
            onRequest(req);
        }
    });
});

</script>

<template lang="pug">
main(@keyup.enter ="onEnter")
    Connection(ref="connectionRef"
        @request="onRequest"
        @connected="onConnected")

    .hero
        button.next-target(v-show="hasNextTargetButton" @click="onNextTarget") {{ nextTargetButtonCaption }}
        .instruction-container(v-show="hasInstruction")
            .instruction(v-for="inst in instruction") {{ inst }}
            img.target(v-if="hasTargetImage" :src="targetImage")

    //- Questionnaire(v-if="isQuestionnaireVisible"
    //-     title="How safe it was to change the lane?"
    //-     :answers="Answers"
    //-     @value="onQuestionnaireAnswer")
    Likert(v-if="isQuestionnaireVisible"
        title="How safe it was to change the lane?"
        @value="onQuestionnaireAnswer")

    h3.debug(v-show="hasDebugMessages")
        div(v-for="err in debugMessages") {{ err }}

    .score-container
        .score-label score:
        .score {{ score }}
</template>

<style>
@import './assets/base.css';
@font-face {
  font-family: Inter;
  src: url(@/assets/fonts/Inter-Regular.ttf);
}
@font-face {
  font-family: Quicksand;
  src: url(@/assets//fonts/Quicksand-Regular.ttf);
}

#app {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 2rem;
    overflow: hidden;
    font-weight: normal;
}

.hero {
    position: fixed;
    display: flex;
    flex-direction: column;

    top: 7em;
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
    margin: 0 2em;
    border-radius: 0.5em;
}

.debug {
    position: fixed;
    left: 1em;
    right: 1em;
    bottom: -0.25em;
    padding: 0.5em 1em;
    text-align: center;

    background-color: var(--color-background-mute);
    border-radius: 0.25em;
    border: rgb(204, 122, 0) 2px solid;
}

img.target {
    margin-top: 2rem;
    height: 300px;
}

.score-container {
    position: fixed;
    top: 0;
    right: 0;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: stretch;
}
.score-label {
    font-family: Quicksand, sans-serif;
    font-size: 2.75em;
    padding-right: 0.25em;
    margin: auto;
}
.score {
    font-family: Inter, sans-serif;
    font-size: 3.5rem;
    line-height: 1em;
    margin: auto;
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
    .score {
        font-size: 5rem;
        min-width: 2.5em;
    }
}

</style>
