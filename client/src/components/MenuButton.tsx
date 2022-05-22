import React from 'react'

export default function MenuButton(props: { toggled?: boolean, disabled?: boolean, onClick?: React.MouseEventHandler, children: React.ReactNode }) {
  const internalToggled = props.toggled || false
  const internalDisabled = props.disabled || false

  return (
    <button
      onClick={props.onClick}
      disabled={internalDisabled}
      className={`${internalToggled ? 'bg-orange-100' : ''} ${internalToggled ? 'text-slate-900' : ''} ${internalDisabled ? 'text-slate-500' : ''} border-slate-100 h-full w-full flex flex-col justify-center items-center text-xs`}>
      {props.children}
    </button>
  )
}
