'use client'

import { useEffect } from 'react'

export default function TelegramLoginButton({ botName }: { botName: string }) {
  useEffect(() => {
    // Define the global callback
    // @ts-ignore
    window.onTelegramAuth = async (user: any) => {
      alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + ')')
      console.log('Sending to backend', user)
      const response = await fetch('/api/auth/login',{
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(user),
      })
      if (response.ok){
        window.location.href = '/dashboard'
      } else{
        alert('Login failed. Check console.')
      }
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botName)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '10')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true

    const div = document.getElementById('telegram-login-container')
    
    // ERROR WAS LIKELY HERE: proper closing of the if statement
    if (div) {
      div.innerHTML = ''
      div.appendChild(script)
    }

  }, [botName]) // This closes the useEffect

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-500 text-sm">Sign in to track your progress</p>
      <div id="telegram-login-container"></div>
    </div>
  )
}