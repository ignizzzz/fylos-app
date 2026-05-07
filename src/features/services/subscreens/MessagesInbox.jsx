import React from 'react';
import { MessageCircle } from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import EmptyServicesState from '../components/shared/EmptyState';
import { findProvider } from '../../../data/services';

// MessagesInbox — list of all conversations the user has with providers.

export default function MessagesInbox({ data, onClose, onOpenThread }) {
  const threads = (data.threads || []).slice().sort((a, b) => {
    return new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0);
  });

  return (
    <SubScreenContainer title="Messages" onClose={onClose}>
      <div className="px-5">
        {threads.length === 0 ? (
          <EmptyServicesState
            icon={MessageCircle}
            title="No conversations yet"
            subtext="Message a provider before booking — many tell us a quick chat sets the right tone."
          />
        ) : (
          <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
            {threads.map((t) => {
              const provider = findProvider(t.providerId);
              const last = t.messages[t.messages.length - 1];
              const lastByMe = last?.senderId === 'me';
              return (
                <button
                  key={t.id}
                  onClick={() => onOpenThread && onOpenThread(t.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:opacity-70"
                >
                  {provider?.photo ? (
                    <img
                      src={provider.photo}
                      alt=""
                      className="w-11 h-11 rounded-[14px] object-cover bg-[#F2F2F7] shrink-0"
                    />
                  ) : (
                    <span className="w-11 h-11 rounded-[14px] bg-[#FFEDE3] flex items-center justify-center text-[#E85D2A] text-[14px] font-bold shrink-0">
                      {provider?.displayName?.charAt(0) || '?'}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13.5px] truncate ${t.unread > 0 ? 'font-bold text-[#111111]' : 'font-semibold text-[#111111]'}`}>
                        {provider?.displayName || 'Provider'}
                      </span>
                      {t.unread > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D] shrink-0" />
                      )}
                      <span className="ml-auto text-[10.5px] text-[#A09A94] shrink-0">{relativeTime(t.lastMessageAt)}</span>
                    </div>
                    {last && (
                      <p className={`text-[12.5px] truncate mt-0.5 ${t.unread > 0 ? 'text-[#3D3D44]' : 'text-[#8E8E93]'}`}>
                        {lastByMe ? 'You: ' : ''}{last.text}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </SubScreenContainer>
  );
}

function relativeTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const ms = now - d;
  const min = Math.round(ms / 60000);
  if (min < 1) return 'now';
  if (min < 60) return `${min} min`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} h`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day} d`;
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}
