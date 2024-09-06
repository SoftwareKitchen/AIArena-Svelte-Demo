<script lang="ts">
    import ConnectFourIndicator from "./ConnectFourIndicator.svelte";
    import {createEventDispatcher} from "svelte";
    import type {ConnectFourState} from "./aiarena-types";

    export let data: ConnectFourState
    export let humanPlayer: boolean
    let dispatch = createEventDispatcher()

    function getForCell(board: (number | null)[][], x: number, y: number): number | null{
        if(data.board[x].length <= y){ return null }
        return data.board[x][y]
    }

    function play(column: number){
        dispatch("human-action", {action: "action", payload: { col: column }})
    }
</script>

<style lang="scss">
    .c4-board{
      display: grid;
      grid-template-columns: repeat(7, 50px);
      grid-template-rows: min-content repeat(6, 50px);
      border-collapse: collapse;
      border: 4px solid white;
      width: min-content;
      padding: 0.5rem;
    }

    .game-cell{
        padding: 10%;
    }

    .arrow{
      text-align: center;
      user-select: none;
      cursor: pointer;
    }

    .no-space{
      height: 0;
    }
</style>

<div class="c4-board">
    {#each Array(7) as _,x}
        {#if humanPlayer}
            <div class="arrow" on:click={() => play(x)}>\/</div>
        {:else}
            <div class="no-space"></div>
        {/if}
    {/each}
        {#each Array(6) as _,y}
        {#each Array(7) as _,x}
            <div class="game-cell">
                <ConnectFourIndicator value={getForCell(data.board, x, 5 - y)} />
            </div>
        {/each}
    {/each}
</div>
