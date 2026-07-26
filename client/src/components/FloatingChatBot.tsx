import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';

/**
 * Floating Chat Bot Widget
 * Displays as a floating button that opens a chat interface with suggested questions
 */
export function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How do I get a quote?',
    'What payment methods do you accept?',
    'What is your lead time for prototypes?',
    'Can you handle large production orders?',
    'What materials do you support?',
    'Do you offer design assistance?',
  ];

  // Common FAQ responses
  const faqResponses: Record<string, string> = {
    'how do i get a quote': 'Getting a quote from Vertex is simple and straightforward:\n\n1. Click the "Get a Quote" button at the top of our website\n2. Fill out the contact form with your project details\n3. Upload your design files or specifications\n4. Specify your required quantity and preferred timeline\n\nOur experienced team will carefully review your request and provide you with a comprehensive, competitive quote within 24 hours.',
    
    'what payment methods do you accept': 'We accept the following payment methods for your convenience:\n\n• Bank Transfer (Wire Transfer)\n• PayPal\n\nOur payment terms are structured as follows:\n• Standard Projects: Full payment is required before production and shipment\n• Large-Scale Projects: 70% deposit upon order confirmation, with the remaining 30% due before shipment\n\nThis flexible approach ensures we can accommodate projects of all sizes while maintaining production efficiency.',
    
    'what is your lead time for prototypes': 'Our production lead times vary depending on the manufacturing process:\n\n• 3D Printing: 3-7 days\n• CNC Machining: 14-30 days\n• Injection Molding: 25-35 days\n\nThese timelines are estimates and may vary based on project complexity and current capacity. Shipping time is not included. We are happy to discuss your specific timeline requirements and explore expedited options if needed.',
    
    'can you handle large production orders': 'Absolutely! We specialize in handling orders of all sizes, from small prototypes to large-scale production runs.\n\nThe more units you order, the more competitive our pricing becomes. We have the capacity and expertise to scale production efficiently while maintaining our high quality standards.\n\nWe would love to discuss your specific production requirements and provide you with volume-based pricing. Please contact us with your details!',
    
    'what materials do you support': 'We work with an extensive range of high-quality materials:\n\n• Plastics: Standard resins, nylon, engineering plastics with high temperature and chemical resistance, and more\n• Metals: Aluminum, stainless steel, brass, copper, titanium, and other alloys\n• Composites and specialty materials\n\nOur engineering team can recommend the optimal material for your specific application based on performance requirements and budget.',
    
    'do you offer design assistance': 'Yes, we provide design support to help ensure your project\'s success:\n\n• 3D Model Review & Repair: We can review and repair 3D design files\n• Design Consultation: For complex modifications, we recommend working with our engineering team or your design partner\n• Manufacturability Analysis: We optimize designs for production efficiency\n\nContact us to discuss your specific design needs and how we can best support your project.',
  };

  // Find matching FAQ response
  const findFaqResponse = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(faqResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return null;
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content }]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Check for FAQ match first
      const faqResponse = findFaqResponse(content);
      
      const assistantMessage = faqResponse || 'Thank you for your question! For more detailed information, please contact our team directly or fill out our contact form. We\'ll get back to you within 24 hours.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      setIsLoading(false);
    }, 800);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        const floatingButton = document.querySelector('[data-floating-chat-button]');
        if (!floatingButton?.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        data-floating-chat-button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center w-14 h-14"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-24 right-6 z-40 w-[500px] max-w-[calc(100vw-2rem)] shadow-2xl rounded-lg overflow-hidden flex flex-col bg-background"
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4">
            <h3 className="font-semibold">Vertex Support</h3>
            <p className="text-sm opacity-90">We're here to help!</p>
          </div>

          {/* Messages Area */}
          <ScrollArea
            ref={scrollRef}
            className="flex-1 p-4"
            style={{ height: '420px' }}
          >
            <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {!isLoading && messages.length > 0 && (
            <div className="px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Other questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(question)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1 rounded-full border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Initial Suggested Questions */}
          {messages.length === 0 && !isLoading && (
            <div className="px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Common questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(question)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1 rounded-full border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-background">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="min-h-10 max-h-20 resize-none"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
