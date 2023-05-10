<script lang="ts">
import { defineComponent } from 'vue'

import type { AnswerOption } from '../questionnaire'

export default defineComponent({
    props: {
        title: String,
        answers: Array<AnswerOption>
    },
    data: () => {
        return {
        };
    },
    emits: ['value'],
    computed: {
    },
    methods: {
        submit(v: number) {
            this.$emit('value', v);
        }
    }
})
</script>

<template lang="pug">
div
    h1.title {{ title }}
    ul.options
        li.option(v-for="answer in answers")
            button(@click="submit(answer.id)") {{ answer.answer }}
            .descriptions
                .descrition(v-for="d in answer.descrition") {{ d }}
</template>

<style scoped>
.title {
    line-height: 1.5;
    text-align: center;
    padding: 3em 0 0.5em;
}

.options {
    position: relative;
}

.option {
    display: flex;
    flex-direction: column;
    padding: 1em 0.5em 0;
    list-style: none;
}

button {
    font-size: 1.75rem;
    padding: 2em;
}

.descriptions {
    pointer-events: none;
    user-select: none;
}

</style>
