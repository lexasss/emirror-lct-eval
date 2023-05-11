<script setup lang="ts">
import { onMounted, ref, computed, handleError } from 'vue'

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
const debugMessage = ref( '' );
const isQuestionnaireVisible = ref( false );

const hasInstruction = computed( () => !!instruction.value.length && !isQuestionnaireVisible.value );
const hasNextTargetButton = computed( () => !!nextTargetButtonCaption.value && !isQuestionnaireVisible.value );
const hasDebugMessage = computed( () => !!debugMessage.value );

function onRequest(request: IRequest) {
    if (request.target === RequestType.button) {
        onRequestButton(request.cmd, request.param)
    }
    else if (request.target === RequestType.questionnaire) {
        isQuestionnaireVisible.value = request.cmd === 'show'
    }
    else if (request.target === RequestType.message) {
        onRequestMessage(request.cmd, request.param)
    }
    else {
        debugMessage.value = `UNKNOWN REQUEST ${request.target} (${request.cmd}, ${request.param})`
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
    if (cmd == 'show') {
        if (text instanceof Array) {
            instruction.value = text
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
    connectionRef.value.send( JSON.stringify( new Response(ResponseType.target, 'random' ) ) );
}

</script>

<template lang="pug">
main
    Connection(ref="connectionRef"
        @request="onRequest")

    .hero
        button.next-target(v-show="hasNextTargetButton" @click="onNextTarget") {{ nextTargetButtonCaption }}
        .instruction-container(v-show="hasInstruction")
            .instruction(v-for="inst in instruction") {{ inst }}

    Questionnaire(v-if="isQuestionnaireVisible"
        title="How safe it was to change the lane?"
        :answers="Answers"
        @value="onQuestionnaireAnswer")

    h3.debug(v-show="hasDebugMessage") {{ debugMessage }}
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

    top: 18em;
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

.instruction {
    font-size: 1.75rem;
}

.next-target {
    padding: 8rem;
    margin: 0 2em;
    font-size: 1.75rem;
    border-radius: 0.5em;
}

.debug {
    color: orangered;
    max-width: 15rem;
}

</style>
