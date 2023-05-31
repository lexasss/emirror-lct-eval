<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import type { Ref } from 'vue'
import type { IRequest } from './comm'

import { Response, ResponseType, RequestType } from './comm'

import Connection from './components/Connection.vue'
import Target from './components/Target.vue'
import Questionnaire from './components/Questionnaire.vue'
import Likert from './components/Likert.vue'
import Score from './components/Score.vue'

const connectionRef = ref()
const instructions: Ref<string[] | string> = ref( [] );
const nextTargetButtonCaption = ref( '' );
const debugMessages: Ref<string[]> = ref( [] );
const isQuestionnaireVisible = ref( false );
const score = ref( 0 );

const hasDebugMessages = computed( () => !!debugMessages.value.length );

function onConnected() {
    nextTargetButtonCaption.value = '';
    instructions.value = [];
    debugMessages.value = [];
    isQuestionnaireVisible.value = false;
    score.value = 0;
}

function onRequest(request: IRequest) {
    if (request.target === RequestType.button) {
        nextTargetButtonCaption.value = request.cmd == 'show' ? (request.param || 'Next target') : '';
    }
    else if (request.target === RequestType.questionnaire) {
        isQuestionnaireVisible.value = request.cmd === 'show';
    }
    else if (request.target === RequestType.message) {
        instructions.value = request.cmd == 'show' ? request.param : [];
    }
    else if (request.target === RequestType.score) {
        score.value = Number.parseInt(request.cmd, 10);
    }
    else {
        debugMessages.value.push( `UNKNOWN REQUEST ${request.target} (${request.cmd}, ${request.param})` );
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
    window.addEventListener( 'error' , (e) => { debugMessages.value.push( `ERROR: ${e.message}` )})

    window.addEventListener( 'keydown', (e) => {
        if (e.key == 'q') {
            onRequest({
                target: RequestType.questionnaire,
                cmd: 'show',
                param: null,
            } as IRequest);
        }
        else if (e.key == 'w') {
            onRequest({
                target: RequestType.button,
                cmd: 'show',
                param: 'BTN',
            } as IRequest);
        }
        else if (e.key == 'e') {
            onRequest({
                target: RequestType.button,
                cmd: 'hide',
                param: null,
            } as IRequest);
        }
        else if (e.key == 'r') {
            onRequest({
                target: RequestType.message,
                cmd: 'show',
                param: ['Found', 'SLIDE'],
            } as IRequest);
        }
        else if (e.key == 'a') {
            onRequest({
                target: RequestType.score,
                cmd: `${score.value - 10}`,
                param: null,
            } as IRequest);
        }
        else if (e.key == 's') {
            onRequest({
                target: RequestType.score,
                cmd: `${score.value + 10}`,
                param: null,
            } as IRequest);
        }
        else if (e.key == 'z') {
            onConnected();
        }
    });
});

</script>

<template lang="pug">
main
    Connection(ref="connectionRef"
        @request="onRequest"
        @connected="onConnected")

    Target(v-show="!isQuestionnaireVisible" 
        :buttonCaption="nextTargetButtonCaption"
        :instructions="instructions"
        @found="onNextTarget")

    //- Questionnaire(v-if="isQuestionnaireVisible"
    Likert(v-if="isQuestionnaireVisible"
        count="5"
        title="How safe it was to change the lane?"
        @value="onQuestionnaireAnswer")

    Score(:value="score")

    h3.debug(v-show="hasDebugMessages")
        div(v-for="err in debugMessages") {{ err }}
</template>

<style>
@import './assets/base.css';

#app {
    margin: 0 1em;
    padding: 0 2rem;
    overflow: hidden;
    font-weight: normal;
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

</style>
