import React from 'react'
import {MOVE_PLAYER, REDUCE_STAMINA} from "../../store/player/playerTypes";
import {PLAYER_X, PLAYER_Y, ROOM_HEIGHT, ROOM_WIDTH, TAIL_SIZE} from "../map/utils";
import {store} from '../../index'
import {GAME_HEIGHT, GAME_WIDTH} from "../game/utils";


function getNewPosition(direction) {
    const oldPos = store.getState().player.position
    switch (direction) {
        case 'w_to':
            return [oldPos[0] - ROOM_WIDTH * 2, oldPos[1]]
        case 'e_to':
            return [oldPos[0] + ROOM_WIDTH * 2, oldPos[1]]
        case 'n_to':
            return [oldPos[0], oldPos[1] - ROOM_WIDTH * 2]
        case 's_to':
            return [oldPos[0], oldPos[1] + ROOM_WIDTH * 2]
    }
}

function generateMap() {
    const rooms = store.getState().map.rooms
    let map = []
    if (rooms.length > 0) {
        let row = []
        let y = 9
        for (let i = 0; i < rooms.length; i++) {
            const item = []
            const room = rooms[i]
            const fields = room.fields
            if (fields) {
                console.log("!(fields.y === y) ",!(fields.y === y))
                if (!(fields.y === y)) {
                    if (!(y % 2 === 0)) {
                        map.unshift(row.reverse())
                    } else {
                        // row.reverse()
                        map.unshift(row)

                    }
                    y--
                    row = []
                    row.unshift(fields)
                }else {
                    row.unshift(fields)
                }
            }

        }
        map.unshift(row)
        console.log("MAP ", map.reverse())
    }
    return map
}

function observeBoundaries(newPos) {
    return (newPos[0] >= PLAYER_X && newPos[0] < (GAME_WIDTH - 100) - PLAYER_X) &&
        (newPos[1] >= 0 && newPos[1] < GAME_HEIGHT - ROOM_HEIGHT)
}

function observePath(rooms, newPos, d) {
    const x = newPos[0] / (ROOM_HEIGHT * 2)
    const y = newPos[1] / (ROOM_HEIGHT * 2)
    // const nextTile = rooms[y][x]
    // console.log("nextTile ", nextTile, "path = ", d)
    if (x !== undefined && y !== undefined) {
        const nextTile = rooms[y][x]
        console.log("nextTile ", nextTile, " d=", d)
        for (const key in nextTile) {
            if (key === d && nextTile[key] > 0) {
                return true
            }
        }
    }
    return false
}

function dispatchMove(newPos, direction, move) {
    const stamina = store.getState().player.stamina
    if (stamina > 0) {
        store.dispatch({type: REDUCE_STAMINA, payload: {stamina: stamina - 1}})
        // store.dispatch({type: MOVE_PLAYER, payload: {position: newPos}})
        move({"direction": direction.slice(0, 1), position: newPos})
    } else {
        store.dispatch({type: MOVE_PLAYER, payload: {position: [PLAYER_X, PLAYER_Y]}})
        store.dispatch({type: REDUCE_STAMINA, payload: {stamina: 100}})
    }

}

function attemptMove(direction, move) {
    const newPos = getNewPosition(direction)
    generateMap()
    if (observeBoundaries(newPos) && observePath(generateMap(), store.getState().player.position, direction)) {
        dispatchMove(newPos, direction, move)
    }
}

// function dispatchMove(direction) {
//     generateMap()
//     const oldPos = store.getState().player.position
//     const stamina = store.getState().player.stamina
//     if (stamina > 0) {
//         store.dispatch({type: REDUCE_STAMINA, payload: {stamina: stamina - 1}})
//         store.dispatch({type: MOVE_PLAYER, payload: {position: observeBoundaries(oldPos, getNewPosition(direction))}})
//     } else {
//         store.dispatch({type: MOVE_PLAYER, payload: {position: [PLAYER_X, PLAYER_Y]}})
//         store.dispatch({type: REDUCE_STAMINA, payload: {stamina: 100}})
//     }
//
// }

export function handleKeyDown(e, d, move) {
    e.preventDefault()
    switch (e.keyCode ? e.keyCode : d) {
        //left key, west
        case 37:
            return attemptMove('w_to', move)
        //up key, north
        case 38:
            return attemptMove('n_to', move)
        //right key, east
        case 39:
            return attemptMove('e_to', move)
        //down key, south
        case 40:
            return attemptMove('s_to', move)
        default:
            console.log(e.keyCode)
    }
}

