import React from 'react'

export default function Header(){
  return (
    <header className="header" role="banner">
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
        <h1 style={{margin:0, fontSize: '1.125rem'}}>Employee Onboarding</h1>
      </div>
    </header>
  )
}
