<script setup lang="ts">
import { onMounted, ref, computed, handleError, onActivated } from 'vue'

import type { Ref } from 'vue'
import type { IRequest } from './common'

import { AnswerOption } from './questionnaire'
import { Response, ResponseType, RequestType } from './common'

import Questionnaire from './components/Questionnaire.vue'
import Connection from './components/Connection.vue'

const Answers: Array<AnswerOption> = [
    new AnswerOption(
        0,
        'Safe',
        ['no cars on the next lane or the cars were far enough'],
    ), new AnswerOption(
        1,
        'Probably safe',
        ['a car on the next lane yet not very close'],
    ), new AnswerOption(
        2,
        'Probably not safe',
        ['a car on the next lane yet not very close but quickly approaching'],
    ), new AnswerOption(
        3,
        'Not safe',
        ['a car on the next lane very close'],
    ),
]

const connectionRef = ref()
const instruction: Ref<string[]> = ref( [] );
const nextTargetButtonCaption = ref( '' );
const debugMessages = ref( [] as string[] );
const isQuestionnaireVisible = ref( false );
const targetImage = ref( '' );

const hasInstruction = computed( () => !!instruction.value.length && !isQuestionnaireVisible.value );
const hasNextTargetButton = computed( () => !!nextTargetButtonCaption.value && !isQuestionnaireVisible.value );
const hasDebugMessages = computed( () => !!debugMessages.value.length );
const hasTargetImage = computed( () => !!targetImage.value );

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
});

</script>

<template lang="pug">
main
    Connection(ref="connectionRef"
        @request="onRequest")

    .hero
        button.next-target(v-show="hasNextTargetButton" @click="onNextTarget") {{ nextTargetButtonCaption }}
        .instruction-container(v-show="hasInstruction")
            .instruction(v-for="inst in instruction") {{ inst }}
            img.target(v-if="hasTargetImage" :src="targetImage")

    Questionnaire(v-if="isQuestionnaireVisible"
        title="How safe it was to change the lane?"
        :answers="Answers"
        @value="onQuestionnaireAnswer")

    h3.debug(v-show="hasDebugMessages")
        div(v-for="err in debugMessages") {{ err }}
</template>

<style>
@import './assets/base.css';

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

    top: 10em;
    bottom: 0;
    left: 0;
    right: 0;
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
