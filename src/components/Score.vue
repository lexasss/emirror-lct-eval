<script lang="ts">
import { defineComponent } from 'vue'

import { settings } from '../settings'

export default defineComponent({
    props: {
        value: Number,
    },
    data: () => {
        return {
            maxScore: 0,
        };
    },
    methods: {
    },
    watch: {
        value(score: number) {
            if (score > this.maxScore) {
                this.maxScore = score;
                settings.value.maxScore = this.maxScore;
                settings.save();
            }
        }
    },
    mounted() {
        this.maxScore = settings.value.maxScore || this.maxScore;
    }
})
</script>

<template lang="pug">
.score-container
    .score-display
        .score-label score:
        .score {{ value }}
    .score-display.record
        .score-label record:
        .score {{ maxScore }}
</template>

<style scoped>
@font-face {
  font-family: Inter;
  src: url(@/assets/fonts/Inter-Regular.ttf);
}
@font-face {
  font-family: Quicksand;
  src: url(@/assets//fonts/Quicksand-Regular.ttf);
}

.score-container {
    position: fixed;
    top: 0;
    right: 0;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
}
.score-display {
    display: flex;
    align-items: stretch;
    align-content: space-between;
}
.score-label {
    font-family: Quicksand, sans-serif;
    font-size: 2.75rem;
    padding-right: 0.25em;
    margin: auto 0;
}
.score {
    font-family: Inter, sans-serif;
    font-size: 3.5rem;
    line-height: 1em;
    margin: auto 0;
}
.record * {
    font-size: 1.5rem;
    color: coral;
}
.record .score {
    font-size: 2.5rem;
}

@media screen and (min-width: 1024px) {
    .score {
        min-width: 2.5em;
    }
}

</style>
