import { DragControls, motion } from "framer-motion"
import { XCircleIcon, ViewListIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, MinusCircleIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/solid'
import React, { ChangeEvent, useEffect, useRef, useState } from "react"


export type NameChangedHandler = (newName: string) => void
export type ScoreChangedHandler = (newScore: number) => void
export type PlayerDeletedHandler = () => void

export type PlayerRowProps = {
  index: number,
  name: string,
  score: number,
  listEditMode?: boolean,
  disableEditMode?: boolean,
  nameChanged?: NameChangedHandler,
  scoreChanged?: ScoreChangedHandler,
  playerDeleted?: PlayerDeletedHandler,
  dragControls?: DragControls
}

export default function PlayerRow(props: PlayerRowProps) {
  const [playAnimation, setPlayAnimation] = useState(false)
  const [scoreEditMode, setScoreEditMode] = useState(false)
  const [editScore, setEditScore] = useState(props.score.toString())
  const [nameEditMode, setNameEditMode] = useState(false)
  const [editName, setEditName] = useState(props.name)

  const [scoreInputFocused, setScoreInputFocused] = useState(false)
  const [nameInputFocused, setNameInputFocused] = useState(false)
  const internalListEditMode = props.listEditMode || false
  const internalDisableEditMode = props.disableEditMode || false

  function handleIncrement() {
    if (props.scoreChanged) {
      props.scoreChanged(props.score + 1)
      setPlayAnimation(true)
    }
  }

  function handleDecrement() {
    if (props.scoreChanged) {
      props.scoreChanged(props.score - 1)
      setPlayAnimation(true)
    }
  }

  function handleAnimationEnd() {
    setPlayAnimation(false)
  }

  function toggleEditScore() {
    if (nameEditMode || props.listEditMode || internalDisableEditMode) return

    setEditScore(props.score.toString())
    setScoreEditMode(!scoreEditMode)

    if (!scoreEditMode) {
      setScoreInputFocused(false)
    } else {
      const doAddition = editScore.startsWith('+')
      const cleanedScoreEdit = doAddition ? editScore.replace('+', '') : editScore
      let newScore: number = Number(cleanedScoreEdit)
      if (doAddition) {
        newScore = newScore + props.score
      }

      if (props.scoreChanged) {
        props.scoreChanged(newScore)
      }
    }
  }

  function toggleNameEditMode() {
    if (scoreEditMode || props.listEditMode || internalDisableEditMode) return

    setNameEditMode(!nameEditMode)
    setNameInputFocused(nameEditMode)

    if (nameEditMode) {
      setEditName(editNameInput.current!.value)
      if (props.nameChanged) {
        props.nameChanged(editName)
      }
    }
  }

  function handleScoreChange(e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value

    if (value.startsWith('+-')) {
      if (isNaN(Number(value.substring(2, value.length)))) {
        return
      }
    } else if (value.startsWith('+')) {
      if (isNaN(Number(value.substring(1, value.length)))) {
        return
      }
    } else if (value.startsWith('-')) {
      if (isNaN(Number(value.substring(1, value.length)))) {
        return
      }
    } else if (isNaN(Number(value))) {
      return
    }

    setEditScore(e.target.value)
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setEditName(e.target.value)
  }

  const editScoreInput: React.RefObject<HTMLInputElement> = useRef(null)
  const editNameInput: React.RefObject<HTMLInputElement> = useRef(null)

  useEffect(() => {
    if (scoreEditMode && !scoreInputFocused) {
      editScoreInput.current!.focus()
      editScoreInput.current!.select()
      setScoreInputFocused(true)
    }

    if (nameEditMode && !nameInputFocused) {
      editNameInput.current!.focus()
      editNameInput.current!.select()
      setNameInputFocused(true)
    }
  })

  function handleScoreInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == 'Enter' || e.key == 'Tab') {
      toggleEditScore()
    } else if (e.key == 'Escape') {
      handleScoreCancel()
    }
  }

  function handleNameInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == 'Enter' || e.key == 'Tab') {
      toggleNameEditMode()
    } else if (e.key == 'Escape') {
      handleNameCancel()
    }
  }

  function handleScoreCancel() {
    setScoreEditMode(false)
  }

  function handleNameCancel() {
    setNameEditMode(false)
    setEditName(props.name)
  }

  function handleRemovePlayer() {
    if (props.playerDeleted) {
      props.playerDeleted()
    }
  }


  const nameEditor = (
    <>
      <motion.input
        initial={{
          opacity: 0,
          width: '0%'
        }}
        animate={{
          opacity: 1,
          width: '100%'
        }}
        transition={{
          type: 'spring',
          stiffness: 100
        }}
        ref={editNameInput}
        type="text"
        onKeyDown={handleNameInputKeyDown}
        onChange={handleNameChange}
        value={editName}
        className="text-3xl text-right font-bold w-full select-all bg-orange-100"
      />
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className={`flex-none`} onClick={handleNameCancel}>
        <XCircleIcon className="h-7 w-9" />
      </motion.button>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className={`flex-none`} onClick={toggleNameEditMode}>
        <CheckCircleIcon className="h-7 w-9" />
      </motion.button>
    </>
  )

  function handleDragStart(e: React.PointerEvent) {
    if (props.dragControls) {
      props.dragControls.start(e)
      e.preventDefault()
    }
  }

  return (
    <div className={`bg-white border-2 border-slate-500 rounded h-14 w-full p-2 flex flex-row items-center justify-between space-x-1`}>
      <button onPointerDown={handleDragStart}>
        <ViewListIcon className={`flex-none h-7 w-7 ${internalListEditMode ? '' : 'hidden'}`} />
      </button>
      {nameEditMode ?
        nameEditor
        :
        <p onClick={toggleNameEditMode} className={`basis-[90%] text-3xl font-bold`}>{props.name}</p>
      }

      {scoreEditMode ?
        <>
          <motion.input
            initial={{
              opacity: 0,
              width: '0%'
            }}
            animate={{
              opacity: 1,
              width: '100%'
            }}
            transition={{
              type: 'spring',
              stiffness: 100
            }}
            ref={editScoreInput}
            type="tel"
            onKeyDown={handleScoreInputKeyDown}
            onChange={handleScoreChange}
            value={editScore}
            className="text-3xl font-bold text-right w-full select-all bg-orange-100"
          />
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className={`flex-none ${scoreEditMode ? '' : 'hidden'}`} onClick={handleScoreCancel}>
            <XCircleIcon className="h-7 w-9" />
          </motion.button>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className={`flex-none`} onClick={toggleEditScore}>
            <CheckCircleIcon className="h-7 w-9" />
          </motion.button>
        </>
        :
        <>
          <button className={`flex-none ${internalListEditMode || scoreEditMode || nameEditMode || internalDisableEditMode ? 'hidden' : ''}`} onClick={handleDecrement}>
            <MinusCircleIcon className="h-7 w-7" />
          </button>
          <p
            onAnimationEnd={handleAnimationEnd}
            onClick={toggleEditScore}
            className={`${playAnimation ? 'animate-ping-once' : ''} basis-32 text-3xl font-bold text-right ${props.score < 0 ? 'text-red-900' : 'text-green-900'} ${nameEditMode ? 'hidden' : ''}`}
          >
            {props.score < 0 ? props.score : `+${props.score}`}
          </p>
          <button className={`flex-none ${internalListEditMode || scoreEditMode || nameEditMode || internalDisableEditMode ? 'hidden' : ''}`} onClick={handleIncrement}>
            <PlusCircleIcon className="h-7 w-7" />
          </button>
        </>
      }

      <button className={`${internalListEditMode ? '' : 'hidden'}`} onClick={handleRemovePlayer}>
        <TrashIcon className={`flex-none h-7 w-7 text-red-700`} />
      </button>
    </div>
  )
}
