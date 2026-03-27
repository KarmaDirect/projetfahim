'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '@/lib/store'
import { Search, Send, Clock, Check, CheckCheck } from 'lucide-react'
import type { Profile, ChatMessage } from '@/lib/types'

export default function MessagesPage() {
  const { currentUser, profiles, messages, sendMessage, markMessagesAsRead } = useStore()
  
  const [activeUserId, setActiveUserId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Determine contacts
  const contacts = profiles.filter(p => {
    if (p.id === currentUser?.id) return false
    if (currentUser?.role === 'admin') return p.role === 'client'
    return p.role === 'admin'
  })

  // Filter contacts by search
  const filteredContacts = contacts.filter(c => 
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Auto-select first contact if none selected
  useEffect(() => {
    if (!activeUserId && filteredContacts.length > 0) {
      setActiveUserId(filteredContacts[0].id)
    }
  }, [filteredContacts, activeUserId])

  // Mark as read when active user changes
  useEffect(() => {
    if (activeUserId && currentUser) {
      markMessagesAsRead(activeUserId, currentUser.id)
    }
  }, [activeUserId, currentUser, markMessagesAsRead, messages.length])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeUserId])

  if (!currentUser) return null

  const activeUser = profiles.find(p => p.id === activeUserId)

  // Get conversation
  const conversation = messages
    .filter(m => 
      (m.sender_id === currentUser.id && m.receiver_id === activeUserId) ||
      (m.sender_id === activeUserId && m.receiver_id === currentUser.id)
    )
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeUserId) return

    sendMessage({
      sender_id: currentUser.id,
      receiver_id: activeUserId,
      content: newMessage.trim()
    })
    setNewMessage('')
    setTimeout(() => {
      markMessagesAsRead(activeUserId, currentUser.id)
    }, 100)
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-full bg-[#FAFBFC] dark:bg-[#0F1117] w-full transition-colors duration-300">
      <div className="flex flex-col md:flex-row h-full md:p-6 w-full max-w-[1600px] mx-auto gap-6 bg-transparent">
        
        {/* Contacts Sidebar List */}
        <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-[#181A20] border border-[#F3F4F6] dark:border-[#23262F] md:rounded-[24px] flex flex-col shrink-0 shadow-sm dark:shadow-none overflow-hidden h-full">
          <div className="p-6 border-b border-[#F3F4F6] dark:border-[#23262F] bg-white dark:bg-[#181A20] z-10">
            <h2 className="text-xl font-bold text-[#1F2937] dark:text-white mb-4 tracking-tight">Discussions</h2>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Rechercher un contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3F4F6] dark:bg-[#23262F] border-none rounded-[16px] py-3 pl-10 pr-4 text-sm text-[#1F2937] dark:text-white focus:ring-2 focus:ring-[#4B5563]/20 focus:outline-none transition-shadow"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white dark:bg-[#181A20]">
            {filteredContacts.length === 0 ? (
              <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm mt-10">Aucun contact trouvé.</div>
            ) : (
              filteredContacts.map(contact => {
                const contactMsgs = messages.filter(m => 
                  (m.sender_id === currentUser.id && m.receiver_id === contact.id) ||
                  (m.sender_id === contact.id && m.receiver_id === currentUser.id)
                ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                
                const lastMsg = contactMsgs[0]
                const unreadCount = contactMsgs.filter(m => m.sender_id === contact.id && !m.read).length
                
                return (
                  <div 
                    key={contact.id}
                    onClick={() => setActiveUserId(contact.id)}
                    className={`p-4 border-b border-[#F3F4F6] dark:border-[#23262F] cursor-pointer transition-colors ${activeUserId === contact.id ? 'bg-[#F3F4F6] dark:bg-[#23262F] border-l-4 border-l-[#4B5563]' : 'bg-white dark:bg-[#181A20] hover:bg-gray-50 dark:hover:bg-[#23262F] border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-[#6B7280] flex items-center justify-center text-white font-bold text-lg shrink-0 relative shadow-sm">
                        {contact.full_name.charAt(0)}
                        {unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] border-2 border-white dark:border-[#181A20] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                            {unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-[#1F2937] dark:text-white truncate text-sm">{contact.full_name}</h3>
                          {lastMsg && (
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium shrink-0 ml-2">{formatTime(lastMsg.created_at)}</span>
                          )}
                        </div>
                        {lastMsg ? (
                          <p className={`text-xs truncate ${unreadCount > 0 ? 'text-[#1F2937] dark:text-white font-bold' : 'text-gray-500'}`}>
                            {lastMsg.sender_id === currentUser.id ? 'Vous: ' : ''}{lastMsg.content}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic">Nouvelle conversation</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#181A20] border border-[#F3F4F6] dark:border-[#23262F] md:rounded-[24px] shadow-sm dark:shadow-none overflow-hidden h-full relative">
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="h-[80px] shrink-0 border-b border-[#F3F4F6] dark:border-[#23262F] px-6 flex items-center justify-between bg-white dark:bg-[#181A20] z-10 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-[#6B7280] flex items-center justify-center text-white font-bold text-lg ring-4 ring-[#F3F4F6] dark:ring-[#23262F]">
                    {activeUser.full_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1F2937] dark:text-white capitalize">{activeUser.full_name}</h2>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest">{activeUser.company} {activeUser.user_type === 'partner' ? '• Partenaire' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth bg-[#FAFBFC]/50 dark:bg-[#0F1117]/50">
                {conversation.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-[#23262F] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-[#23262F]">
                      <Clock size={32} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium tracking-wide text-gray-500">Commencez la discussion avec {activeUser.full_name}</p>
                  </div>
                ) : (
                  conversation.map((msg, index) => {
                    const isMe = msg.sender_id === currentUser.id
                    const showAvatar = index === 0 || conversation[index - 1].sender_id !== msg.sender_id

                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
                        <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          
                          {/* Avatar Snippet */}
                          <div className="w-8 shrink-0 flex flex-col justify-end">
                            {showAvatar && (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${isMe ? 'bg-[#1F2937]' : 'bg-linear-to-br from-primary to-[#6B7280]'}`}>
                                {isMe ? currentUser.full_name.charAt(0) : activeUser.full_name.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div 
                              className={`px-5 py-3.5 rounded-2xl relative shadow-xs ${
                                isMe 
                                  ? 'bg-linear-to-br from-primary to-[#6B7280] text-white rounded-br-sm' 
                                  : 'bg-white dark:bg-[#23262F] border border-[#F3F4F6] dark:border-[#23262F] text-[#1F2937] dark:text-white rounded-bl-sm'
                              }`}
                            >
                              <p className="text-[14px] md:text-[15px] leading-relaxed wrap-break-word">{msg.content}</p>
                            </div>
                            
                            {/* Timestamp & Read Status */}
                            <div className={`flex items-center gap-1.5 mt-2 px-1 text-[10px] font-bold tracking-widest uppercase ${isMe ? 'flex-row-reverse text-[#9CA3AF]' : 'flex-row text-[#9CA3AF]'}`}>
                              <span>{formatTime(msg.created_at)}</span>
                              {isMe && (
                                msg.read ? <CheckCheck size={14} className="text-primary" /> : <Check size={14} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                {/* Scroll Bottom Anchor */}
                <div ref={messagesEndRef} className="h-1 text-transparent">-</div>
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white dark:bg-[#181A20] border-t border-[#F3F4F6] dark:border-[#23262F]">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez un message..."
                    className="w-full bg-[#F3F4F6] dark:bg-[#23262F] border-none rounded-[20px] py-4 pl-6 pr-16 text-[15px] text-[#1F2937] dark:text-white focus:ring-2 focus:ring-[#4B5563]/20 focus:outline-none transition-shadow"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary hover:bg-[#6B7280] disabled:bg-[#F3F4F6] dark:disabled:bg-[#2C2F38] disabled:text-gray-400 flex items-center justify-center text-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm dark:shadow-none"
                  >
                    <Send size={18} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-[#9CA3AF] dark:text-gray-500 bg-[#FAFBFC] dark:bg-[#0F1117]">
              <p className="font-medium tracking-wide">Sélectionnez une discussion pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
