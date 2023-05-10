<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import { AnswerOption } from './questionnaire'
import { Response, RequestTarget } from './ws-io'

import type { IRequest } from './ws-io'

import Questionnaire from './components/Questionnaire.vue'

interface ISettings {
    ip: string;
}

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

const enum ConnState {
    NotInitialized,
    NotConnected,
    Connecting,
    Connected,
}

let socket: WebSocket | null = null;

const value = ref( 0 );
const isQuestionnaireVisible = ref( false );
const connState = ref( ConnState.NotInitialized );
const ip = ref( '127.0.0.1' );
const instruction = ref( 'Cannot connect to the experiment app' );
const nextTargetButtonCaption = ref( 'Next target' );
const debugMessage = ref( '' );

const isConnectionClosed = computed( () => connState.value === ConnState.NotConnected );
const isNotConnected = computed( () => connState.value === ConnState.NotConnected || connState.value === ConnState.Connecting );
const isConnected = computed( () => connState.value === ConnState.Connected );
const connectionStateText = computed( () =>
    connState.value === ConnState.NotConnected ? 'Cannot connect to the experiment app' :
    connState.value === ConnState.Connecting ? 'Connecting...' :
    connState.value === ConnState.Connected ? 'Connected' : ''
);
const hasInstruction = computed( () => !!instruction.value && !isQuestionnaireVisible.value );
const hasNextTargetButton = computed( () => !!nextTargetButtonCaption.value && !isQuestionnaireVisible.value );
const hasDebugMessage = computed( () => !!debugMessage.value );


function connect() {
    connState.value = ConnState.Connecting;
    const socket = new WebSocket( `ws://${ip.value}:15555` );

    socket.addEventListener( 'open', e => {
        console.log('[CONN] opened');
        connState.value = ConnState.Connected;
    });
    socket.addEventListener( 'close', e => {
        console.log('[CONN] closed');
        connState.value = ConnState.NotConnected;
    });
    socket.addEventListener( 'error', e => {
        connState.value = ConnState.NotConnected;
    });
    socket.addEventListener('message', e => {
        console.log( `[CONN] msg = ${e.data}` );
        const request: IRequest = JSON.parse( e.data );

        if (request.target === RequestTarget.button) {

        }
        else if (request.target === RequestTarget.questionnaire) {
            isQuestionnaireVisible.value = request.cmd === 'show'
        }
        else if (request.target === RequestTarget.message) {
            if (request.cmd == 'show') {
                instruction.value = request.param
            }
            else {
                instruction.value = ''
            }
        }
        else {
            debugMessage.value = `UNKNOWN REQUEST ${request.target} (${request.cmd}, ${request.param})`
        }
    });

    return socket;
}

function onQuestionnaireAnswer( e: number ) {
    value.value = e;

    isQuestionnaireVisible.value = false;
    socket?.send( JSON.stringify( new Response('', value.value ) ) );
}

function applySettings() {
    localStorage.setItem( 'emirrorquest', JSON.stringify({
        ip: ip.value,
    } as ISettings));

    socket?.close();
    socket = connect();
}

onMounted(() => {
    const settingsStr = localStorage.getItem( 'emirrorquest' );
    if (settingsStr) {
        const settings = JSON.parse( settingsStr ) as ISettings;
        ip.value = settings.ip || ip.value;
    }

    socket = connect();
})

</script>

<template lang="pug">
main
    h2.message(v-show="isNotConnected" :class="{ error: isConnectionClosed }") {{ connectionStateText }}
        .settings(v-if="isConnectionClosed")
            .row
                .label IP 
                input.setting(type="text" v-model="ip")
            .row
                button.apply(@click="applySettings") Apply
    h2.message.status(v-show="isConnected") {{ connectionStateText }}

    .hero
        h1.instruction(v-show="hasInstruction") {{ instruction }}
        button.next-target(v-show="hasNextTargetButton") {{ nextTargetButtonCaption }}

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

.message {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: -0.5em;
    padding: 1.75em 2.5em;
    left: 50%;
    background-color: var(--color-background-soft);
    border-radius: 0.25em;
    border: #06a 2px solid;
    transform: translateX(-50%);
}

.status {
    padding: 0.75em 2.5em;
}

.error {
    border: #800 2px solid;
    background-color: rgba(128, 0, 0, 0.2);
}

.settings {
    display: flex;
    flex-direction: column;
    padding: 0.5em;
    margin-top: 1em;
    border-radius: 0.25em;
    border: #06a 2px solid;
    background-color: rgba(0, 102, 170, 0.2);
}

.row {
    display: flex;
    flex-direction: row;
    margin: 0.25em 0;
}

.label {
    padding: 0 1.5em 0 0;
}

.setting {
    font-size: 1rem;
    flex-grow: 1;
}

button.apply {
    font-size: 1rem;
    margin: 0.25em 0 0 0;
    padding: 0.75em 1.5em;
    flex-grow: 1;
}

.hero {
    position: fixed;
    display: flex;
    flex-direction: column;

    top: 20%;
    bottom: 0;
    left: 0;
    right: 0;
}

.instruction {
    color: chartreuse;
    padding: 1em;
    padding-top: calc(40% - 1em);
    text-align: center;
    align-self: center;
}

.next-target {
    padding: 5rem 8rem;
    font-size: 1.75rem;
    height: 40%;
}

.debug {
    color: orangered;
    max-width: 15rem;
}

</style>
