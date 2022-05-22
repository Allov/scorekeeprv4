import { motion, Reorder, /*useDragControls*/ } from 'framer-motion'
import { UserAddIcon, RefreshIcon, ShareIcon, CollectionIcon, DotsVerticalIcon, /*ViewListIcon*/ } from '@heroicons/react/outline'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Player } from '../types'
import { useParams } from 'react-router-dom'
import PlayerRow from '../components/PlayerRow'
import MenuButton from '../components/MenuButton'
import Loading from '../components/Loading'
import React, { useRef, useState } from 'react'

const animation = {
  in: {
    y: 0,
    opacity: 1
  },
  initial: {
    y: -100,
    opacity: 0
  },
  out: {
    opacity: 0
  }
}

const playerAnimation = {
  in: {
    x: 0,
    opacity: 1
  },
  out: {
    x: 50,
    opacity: 0
  }
}

const playerAnimation2 = {
  in: {
    y: 0,
    opacity: 1
  },
  out: {
    y: -50,
    opacity: 0
  }
}

const playerAnimationNoMovement = {
  in: {
    x: 0,
    opacity: 1
  },
  out: {
    x: 0,
    opacity: 1
  }
}

const gameByIdQuery = gql`
  query Game($id: ID!) {
    game(id: $id) {
      id,
      name,
      players {
        id,
        name,
        score
      }
    }
  }
`

const addPlayerToGameMutation = gql`
  mutation AddPlayerToGame($playerName: String!, $gameId: ID!) {
    createPlayerAndAddToGame(name: $playerName, gameId: $gameId) {
      id,
      name,
      score
    }
  }
`
const updatePlayerMutation = gql`
  mutation UpdatePlayer($updatePlayerId: ID!, $newName: String, $newScore: Int) {
    updatePlayer(id: $updatePlayerId, newName: $newName, newScore: $newScore) {
      id,
      name,
      score
    }
  }
`

const removePlayerMutation = gql`
  mutation RemovePlayerFromGame($playerId: ID!, $gameId: ID!) {
    removePlayerFromGame(id: $playerId, gameId: $gameId) {
      id
    }
  }
`

const resetGameScoreMutation = gql`
  mutation ResetGameScore($id: ID!) {
    resetGameScore(id: $id) {
      id
    }
  }
`

const reorderPlayersMutation = gql`
  mutation ReorderPlayers($gameId: ID!, $playerIds: [ID!]) {
    reorderPlayers(gameId: $gameId, playerIds: $playerIds) {
      id,
    }
  }
`

let reorderPlayersDebounce: number
async function handleReorderPlayers(players: any[], data: any, reorderPlayers: any) {
  window.clearTimeout(reorderPlayersDebounce)
  reorderPlayersDebounce = window.setTimeout(async () => await reorderPlayersInternal(players, data, reorderPlayers), 50)
}

async function reorderPlayersInternal(players: any[], data: any, reorderPlayers: any) {
  const orderedPlayers = players.map((player: Player) => data.game.players.filter((p: Player) => p.id == player.id))

  await reorderPlayers({
    variables: {
      gameId: data.game.id,
      playerIds: players.map((player: Player) => player.id)
    },
    update: (cache: any) => {
      const query = {
        query: gameByIdQuery,
        variables: {
          id: data.game.id
        },
        data: {
          ...data,
          game: {
            ...data.game,
            players: orderedPlayers,
          }
        }
      }

      cache.writeQuery(query)
    }
  })
}


function Game() {
  const parameters = useParams()

  const [orderingMode, setOrderingMode] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const bottomDiv: React.RefObject<HTMLInputElement> = useRef(null)


  const { data } = useQuery(gameByIdQuery, { variables: { id: parameters.id } })
  const [createPlayerAndAddToGame] = useMutation(addPlayerToGameMutation, {
    refetchQueries: [
      gameByIdQuery,
      'Game'
    ]
  })

  const [updatePlayer] = useMutation(updatePlayerMutation, {
    refetchQueries: [
      gameByIdQuery,
      'Game'
    ]
  })

  const [deletePlayer] = useMutation(removePlayerMutation, {
    refetchQueries: [
      gameByIdQuery,
      'Game'
    ]
  })

  const [resetGameScore] = useMutation(resetGameScoreMutation, {
    refetchQueries: [
      gameByIdQuery,
      'Game'
    ]
  })

  const [reorderPlayers] = useMutation(reorderPlayersMutation, {
    refetchQueries: [
      gameByIdQuery,
      'Game'
    ]
  })

  async function handleAddPlayer() {
    await createPlayerAndAddToGame({
      variables: {
        gameId: data.game.id,
        playerName: `Player ${data.game.players.length + 1}`
      },
      optimisticResponse: {
        createPlayerAndAddToGame: {
          __typename: 'Player',
          id: '',
          name: `Player ${data.game.players.length + 1}`,
          score: 0
        }
      },
      update: (cache, { data: { createPlayerAndAddToGame } }) => {
        cache.writeQuery({
          query: gameByIdQuery,
          variables: {
            id: parameters.id
          },
          data: {
            ...data,
            game: {
              ...data.game,
              players: [
                ...data.game.players,
                createPlayerAndAddToGame
              ]
            }
          }
        })
      }
    })
  }

  function handleShare() {
    navigator.share({
      title: data.game.title,
      text: `scorekeepr let's you follow the scoring of a friendly game on your phone!`,
      url: window.location.href
    })
  }

  function toggleOrderingMode() {
    setOrderingMode(!orderingMode)
  }

  async function handleUpdatePlayer(player: Player, newName: string, newScore: number) {
    await updatePlayer({
      variables: {
        updatePlayerId: player.id,
        newName: newName,
        newScore: newScore
      },
      optimisticResponse: {
        updatePlayer: {
          __typename: 'Player',
          id: player.id,
          name: newName,
          score: newScore
        }
      },
    })
  }

  async function handleDeletePlayer(player: Player) {
    await deletePlayer({
      variables: {
        playerId: player.id,
        gameId: data.game.id
      },
      optimisticResponse: {
        removePlayerFromGame: {
          __typename: 'Player',
          id: player.id
        }
      },
      update: (cache, { data: { removePlayerFromGame } }) => {
        const newPlayers = data.game.players.filter((p: Player) => p != removePlayerFromGame)

        cache.writeQuery({
          query: gameByIdQuery,
          variables: {
            id: parameters.id
          },
          data: {
            ...data,
            game: {
              ...data.game,
              players: [
                ...newPlayers,
              ]
            }
          }
        })
      }
    })
  }

  async function handleResetGameScore() {
    await resetGameScore({
      variables: {
        id: data.game.id,
      },
      optimisticResponse: {
        resetGameScore: {
          __typename: 'Game',
          id: data.game.id
        }
      },
      update: (cache) => {
        const query = {
          query: gameByIdQuery,
          variables: {
            id: parameters.id
          },
          data: {
            ...data,
            game: {
              ...data.game,
              players: data.game.players.map((p: Player) => {
                return {
                  ...p,
                  score: 0
                }
              }),
            }
          }
        }

        cache.writeQuery(query)
      }
    })
  }

  // function DraggablePlayerRow(props: { player: Player, i: number }) {
  //   // const dragControls = useDragControls()
  //   // function handleDragStart(e: React.PointerEvent) {
  //   //   if (dragControls) {
  //   //     console.log('yo')
  //   //     dragControls.start(e)
  //   //     // e.preventDefault()
  //   //   }
  //   // }
  //   return (
  //     // <motion.div initial="out" animate="in" exit="out" variants={playerAnimation2} transition={{ delay: props.i * .04 }}>
  //     <Reorder.Item value={props.player} className='flex'>
  //       <PlayerRow index={props.i} name={props.player.name} score={props.player.score} listEditMode />
  //     </Reorder.Item>
  //     // </motion.div>
  //   )
  // }


  if (data) {
    return (
      <>
        <div className={`game-page-height w-full flex justify-start p-4 overflow-x-hidden ${orderingMode ? 'bg-orange-100' : ''}`}>
          <motion.div initial="initial" animate="in" exit="out" variants={animation} className="flex flex-col w-[100vw] space-y-5">
            <h1 className="text-3xl dark:text-slate-100 text-slate-900">
              {data.game.name}
            </h1>
            {orderingMode ?
              <Reorder.Group values={data.game.players} axis="y" onReorder={(players: any[]) => handleReorderPlayers(players, data, reorderPlayers)} className="w-full space-y-5">
                {data.game.players.map((player: Player, i: number) => {
                  return (
                    <motion.div key={player.id} initial="out" animate="in" exit="out" variants={playerAnimation2} transition={{ delay: i * .04 }}>
                      <Reorder.Item value={player} className='flex'>
                        <PlayerRow
                          index={i}
                          name={player.name}
                          score={player.score}
                          playerDeleted={() => handleDeletePlayer(player)}
                          listEditMode
                        />
                      </Reorder.Item>
                    </motion.div>
                  )
                })}
              </Reorder.Group>
              :
              data.game.players.map((player: Player, i: number) => {
                return (
                  <motion.div
                    key={player.id}
                    initial="out"
                    animate="in"
                    exit="out"
                    variants={firstRender || player.id == '' ? playerAnimation : playerAnimationNoMovement} transition={{ delay: firstRender ? i * .04 : 0 }}
                    onAnimationComplete={() => {
                      if (data.game.players.length == i + 1) {
                        setFirstRender(false)
                        if (!firstRender) { // we're adding a player to the list, let's make sure it's in the view
                          bottomDiv.current?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }
                    }}
                  >
                    <PlayerRow
                      index={i}
                      name={player.name}
                      score={player.score}
                      nameChanged={(newName) => handleUpdatePlayer(player, newName, player.score)}
                      scoreChanged={(newScore) => handleUpdatePlayer(player, player.name, newScore)}
                    />
                  </motion.div>
                )
              })
            }
            <div className='min-h-[1rem]' ref={bottomDiv} />
          </motion.div>
        </div>
        <motion.footer initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="block fixed bottom-0 z-50 w-full keyboard-hidden">
          <div className="flex justify-between text-slate-100 bg-gradient-to-b from-slate-900 to-slate-800 h-[8vh]">
            <MenuButton onClick={handleShare} disabled={orderingMode}>
              <ShareIcon className="h-5 w-5" />
              Share Game
            </MenuButton>
            <MenuButton toggled={orderingMode} onClick={toggleOrderingMode}>
              <CollectionIcon className="h-5 w-5" />
              Modify List
            </MenuButton>
            <MenuButton disabled={orderingMode} onClick={handleResetGameScore}>
              <RefreshIcon className="h-5 w-5" />
              Reset Scores
            </MenuButton>
            <MenuButton onClick={handleAddPlayer} disabled={orderingMode}>
              <UserAddIcon className="h-5 w-5" />
              Add Player
            </MenuButton>
            <button className="flex-1 justify-center items-center bg-slate-900 hidden" disabled={orderingMode}>
              <DotsVerticalIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.footer>
      </>
    )
  }

  return <Loading />
}

export default Game
