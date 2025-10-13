import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  userType: 'admin' | 'member' | 'creator';
}

interface CommunityChatProps {
  communityId: string;
  communityName: string;
}

export const CommunityChat = ({ communityId, communityName }: CommunityChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'Alice',
      message: 'What do you think about the Bitcoin market?',
      timestamp: new Date(Date.now() - 300000),
      userType: 'member',
    },
    {
      id: '2',
      user: 'Bob',
      message: 'Looking bullish based on the technical analysis!',
      timestamp: new Date(Date.now() - 240000),
      userType: 'member',
    },
    {
      id: '3',
      user: 'Community Manager',
      message: 'Remember to DYOR before making any trades!',
      timestamp: new Date(Date.now() - 120000),
      userType: 'admin',
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage,
      timestamp: new Date(),
      userType: 'member',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getUserBadgeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-destructive/20 text-destructive';
      case 'creator': return 'bg-primary/20 text-primary';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <Card className="gradient-card border-border/50 h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>
          {communityName} Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge className={getUserBadgeColor(message.userType)}>
                    {message.user}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="bg-muted/20 rounded-lg p-3 ml-4">
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="bg-card border-border"
            />
            <Button type="submit" size="sm" className="btn-quantum">
              <PaperAirplaneIcon className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};