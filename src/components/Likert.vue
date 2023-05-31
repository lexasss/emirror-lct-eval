<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        title: String,
    },
    data: () => {
        return {
            values: [1, 2, 3, 4, 5]
        };
    },
    emits: ['value'],
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
        li.option(v-for="value in values")
            button(@click="submit(value)") {{ value }}
    .labels
        .label Unsafe
        .label Safe
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
    padding: 5em 0 0;
}

.option {
    display: flex;
    flex-direction: column;
    padding: 1em 0.5em;
    list-style: none;
}

button {
    font-size: 1.75rem;
    padding: 2em;
}

.labels {
    display: flex;
    justify-content: space-between;
    font-size: 3.75em;
    padding: 0.5em;
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
