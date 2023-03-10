import { User } from "@prisma/client"
import { Dispatch, SetStateAction, useState } from "react";
import { IoChatboxOutline } from "react-icons/io5";
import { PLACEHOLDER_IMAGE } from "../constants";
import IconButton from "./IconButton/IconButton";
import Conversations from "./Conversations/Conversations";
import { api } from "../utils/api";
import Messages from "./Messages/Messages";
import Image from "next/image";
export interface ChatState {
  currentConversationId: string | null;
  currentRecipient: Partial<User> | null;
  setCurrentConversationId: Dispatch<SetStateAction<string | null>>;
  setCurrentRecipient: Dispatch<SetStateAction<Partial<User> | null>>;
}
const Chat = () => {
  const utils = api.useContext();
  api.chat.onSendMessage.useSubscription(undefined, {
    onData: ({ conversationId }) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.chat.conversations.invalidate();
      
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.chat.messages.invalidate({ conversationId });
      if (!showConversations && currentConversationId !== conversationId) {
        setShowNotificationBadge(true);
      }
    },
  })
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentRecipient, setCurrentRecipient] = useState<Partial<User> | null>(null);
  const [conversationQueue, setConversationQueue] = useState<
    { conversationId: string; recipient: Partial<User> }[]
  >([]);
  const [showConversations, setShowConversations] = useState(false);

  const [showNotificationBadge, setShowNotificationBadge] = useState(false);

  const selectConversation = (
    currentConversationId: string,
    recipient: Partial<User> | null
  ) => {
    setCurrentConversationId(currentConversationId);
    setCurrentRecipient(recipient);
    setShowConversations(false);
    removeFromConvoQueue(currentConversationId);
  };  

  const addToConvoQueue = (
    conversationId: string,
    recipient: Partial<User>
  ) => {
    setConversationQueue((queue) => [{ conversationId, recipient }, ...queue]);
    closeMessages();
  };
  const removeFromConvoQueue = (conversationId: string) => {
    setConversationQueue((queue) =>
      queue.filter((convoEntry) => convoEntry.conversationId !== conversationId)
    );
  };

  const closeMessages = () => {
    setCurrentConversationId(null);
    setCurrentRecipient(null);
  };

  return (
    <div className="relative">
      <IconButton
        onClick={() => {
          setShowConversations((conversations) => !conversations);
          if (showNotificationBadge) {
            setShowNotificationBadge(false);
          }
        }}
        shouldFill={showConversations}
      >
        <IoChatboxOutline />
      </IconButton>
      {showNotificationBadge && (
        <div className="absolute right-[6px] top-[6px] h-2 w-2 animate-pulse rounded-full bg-red-600" />
      )}
      {showConversations && (
        <Conversations selectConversation={selectConversation} />
      )}
      {currentConversationId && (
        <Messages
          currentRecipient={currentRecipient}
          currentConversationId={currentConversationId}
          setCurrentRecipient={setCurrentRecipient}
          setCurrentConversationId={setCurrentConversationId}
          closeMessages={closeMessages}
          addToConvoQueue={addToConvoQueue}
          queueLength={conversationQueue.length}
        />
      )}
      {conversationQueue.length > 0 && (
        <ul className="fixed bottom-4 right-4 space-y-3 leading-[0] ">
          {conversationQueue.map((convoEntry) => {
            return (
              <li key={convoEntry.conversationId}>
                <button
                  onClick={() => {
                    setCurrentConversationId(convoEntry.conversationId);
                    setCurrentRecipient(convoEntry.recipient);
                    removeFromConvoQueue(convoEntry.conversationId);
                  }}
                >
                  <Image
                    src={convoEntry.recipient.image || PLACEHOLDER_IMAGE}
                    alt="avatar profile image"
                    className="h-12 w-12 rounded-full"
                    width={48}
                    height={48}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}

export default Chat