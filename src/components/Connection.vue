<script lang="ts">
import { defineComponent } from 'vue'

import { settings } from '../settings'

import type { IRequest } from '../comm'

const enum ConnState {
    NotInitialized,
    NotConnected,
    Connecting,
    Connected,
}

interface IComponentData {
    socket: WebSocket | null;
    connState: ConnState;
    ip: string;
}

export default defineComponent({
    data: () => {
        return {
            socket: null,
            connState: ConnState.NotInitialized,
            ip: '127.0.0.1'
        } as IComponentData;
    },
    emits: ['request', 'connected'],
    computed: {
        isConnectionClosed() { return this.connState === ConnState.NotConnected; },
        isNotConnected() { return this.connState === ConnState.NotConnected || this.connState === ConnState.Connecting; },
        isConnected() { return this.connState === ConnState.Connected; },
        connectionStateText() {
            return  this.connState === ConnState.NotConnected ? 'Cannot connect to the experiment app' :
                    this.connState === ConnState.Connecting ? 'Connecting...' :
                    this.connState === ConnState.Connected ? 'Connected' : ''
        },
    },
    methods: {
        connect() {
            this.connState = ConnState.Connecting;
            const socket = new WebSocket( `ws://${this.ip}:15555` );

            socket.addEventListener( 'open', e => {
                console.log('[CONN] opened');
                this.connState = ConnState.Connected;
            });
            socket.addEventListener( 'close', e => {
                console.log('[CONN] closed');
                this.connState = ConnState.NotConnected;
            });
            socket.addEventListener( 'error', e => {
                this.connState = ConnState.NotConnected;
            });
            socket.addEventListener('message', e => {
                console.log( `[CONN] msg = ${e.data}` );
                const request: IRequest = JSON.parse( e.data );
                this.$emit('request', request);
            });

            return socket;
        },

        send(data: string) {
            console.log('SND', data);
            this.socket?.send(data);
        },

        applySettings() {
            settings.value.ip = this.ip;
            settings.save();

            this.socket?.close();
            this.socket = this.connect();
        }
    },
    watch: {
        connState(newValue) {
            if (newValue == ConnState.Connected) {
                this.$emit('connected');
            }
        }
    },
    mounted() {
        this.ip = settings.value.ip;
        this.socket = this.connect();
    },
})
</script>

<template lang="pug">
.conn
    h2.message(v-show="isNotConnected" :class="{ error: isConnectionClosed }") {{ connectionStateText }}
        .settings(v-if="isConnectionClosed")
            .row
                .label IP 
                input.setting(type="text" v-model="ip")
            .row
                button.apply(@click="applySettings") Apply
    h2.message.status(v-show="isConnected") {{ connectionStateText }}
</template>
    
<style scoped>
.conn {
    z-index: 1;
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
.message.status {
    padding: 0.75em 2.5em;
}
.message.error {
    border: #800 2px solid;
    background-color: rgba(255, 192, 192, 0.8);
    white-space: nowrap;
}
@media (prefers-color-scheme: dark) {
.message.error {
    color: var(--vt-c-text-light-1);
}
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

input.setting {
    font-size: 1rem;
    flex-grow: 1;
}

button.apply {
    font-size: 1rem;
    margin: 0.25em 0 0 0;
    padding: 0.75em 1.5em;
    flex-grow: 1;
}

</style>
