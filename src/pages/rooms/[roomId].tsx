import {useState} from 'react'
import { useRouter } from 'next/router'
import { api } from '../../utils/api'
import { Session } from 'next-auth'
import { Message } from '../../constants/schemas'
import { signIn, signOut, useSession } from 'next-auth/react'

function MessageItem({message,session}:{message: Message,session: Session}){

  const baseStyles = "mb-4 text-md w-7/12 p-4 text-gray-700 border border-gray-700 rounded-md"
  const liStyles = message.sender.name === session.user?.name ? baseStyles : baseStyles.concat("self-end bg-gray-700 text-white")
  
  return (
    <li className={liStyles}>
      <div className='flex'>
        <time>
          {message.sentAt.toLocaleTimeString("en-AU", {
            timeStyle:"short"
          })}{" "}
          - {message.sender.name}
        </time>
      </div>
      {message.message}
    </li>
  )
}

const roomPage = () => {
  return (
    <div>[roomId]</div>
    
  )
}

export default roomPage