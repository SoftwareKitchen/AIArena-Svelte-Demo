<script lang="ts">
    export let value: number | null
</script>

<style lang="scss">

  .game-cell-indicator{
    border: 2px solid white;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .game-cell-indicator-player-0 {
    background-color: #ff0;
  }

  .game-cell-indicator-player-1 {
    background-color: #f0f;
  }
</style>

<div
        class="game-cell-indicator"
        class:game-cell-indicator-player-0={value === 0}
        class:game-cell-indicator-player-1={value === 1}
>
</div>
