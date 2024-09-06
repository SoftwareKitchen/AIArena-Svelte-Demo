<script lang="ts">
    /*
    Start a game:
    POST https://ai-arena.de/api/
    {
        "game": "Connect Four",
        "config": {},
        "players": [
            {"type": "player"},
            {"type": "random"}
        ],
        "numGames": 15
    }
    Kill an existing game
    DELETE https://ai-arena.de/api/

     */

    import {onMount} from "svelte";
    import type {ConnectFourState, MatchIdentifier} from "./aiarena-types";

    let connection: WebSocket
    let authenticated = false
    let authKey: string = ""
    let lastMessage: string | null = null
    let inGame = false
    let gameState: ConnectFourState | null = null

    onMount(() => {
        connection = new WebSocket("wss://ai-arena.de/api/live")
        connection.onopen = () => {
            connection.onmessage = (msg) => {
                onMessage(JSON.parse(msg.data))
            }
        }

        setInterval(searchForGame, 3000)
    })

    function joinGame(id: string){
        connection.send(JSON.stringify(
            {
                action: "join",
                match: id
            }
        ))
        inGame = true
    }

    function searchForGame(){
        console.log("Searching")
        if(!authenticated || inGame){ return }
        connection.send(JSON.stringify(
            {
                action: "match-list",
                game: "Connect Four"
            }
        ))
    }

    function onMessage(message: object){
        let type = message.type

        if(type === "identified"){
            authenticated = true
            return
        }
        if(type === "open-lobbies"){
            let matchList: MatchIdentifier[] = message.matches
            if(matchList.length === 0){
                lastMessage = "Kein Spiel da."
            }else{
                joinGame(matchList[0].match)
            }
        }
        if(type === "game-update"){
            gameState = message.state
            if(message.slot == message.activePlayer){
                theActualAI()
            }
        }
    }

    function authenticate(){
        connection.send(JSON.stringify(
            {
                action: "identify",
                token: authKey
            }
        ))
    }

    function theActualAI(){
        for(let i=0;i<7;i++){
            if(gameState.board![i].length < 6){
                connection.send(JSON.stringify(
                    {
                        action: "action",
                        payload: {
                            col: i
                        }
                    }
                ))
                return
            }
        }
    }
</script>

<style lang="scss">
    #root-page{
      background-color: black;
      width: 100vw;
      height: 100vh;
    }

    .last-message{
      color: white;
    }
</style>

<div id="root-page">
    {#if !authenticated}
        <input type="text" bind:value={authKey} /><br>
        <button on:click={authenticate} >Go for it</button>
    {/if}

    <div class="last-message">
        {lastMessage}
    </div>
</div>
