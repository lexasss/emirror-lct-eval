<script lang="ts">
import { defineComponent } from 'vue'

import { AnswerOption } from '../questionnaire'

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

export default defineComponent({
    props: {
        title: String,
    },
    data: () => {
        return {
            answers: Answers,
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
    display: flex;
    flex-direction: row;
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

@media screen and (max-width: 1024px) {
    .options {
        flex-direction: column;
    }
}
@media screen and (min-width: 1024px) {
    .options {
        align-items: stretch;
        bottom: 0;
    }
    .option {
        width: 25%;
        min-height: 12rem;
    }
    .option > button {
        min-height: 15rem;
    }
}

</style>
