"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ME_URL, CHATBOT_API_URL, ALL_STUDENTS_URL, getStudentByIdUrl } from "@/constants";

// Function to parse markdown-like text and convert to React elements
const parseMarkdown = (text: string): React.ReactNode[] => {
  if (!text) return [text];

  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  
  lines.forEach((line, lineIndex) => {
    // Check for headers (###)
    if (line.trim().startsWith('###')) {
      const headerText = line.replace(/^###\s*/, '');
      const headerContent = parseBoldText(headerText);
      result.push(
        <h3 key={lineIndex} className="text-base font-bold mt-3 mb-2">
          {headerContent}
        </h3>
      );
      return;
    }

    // Check for list items (-)
    if (line.trim().startsWith('-')) {
      const listText = line.replace(/^-\s*/, '');
      const listContent = parseBoldText(listText);
      result.push(
        <div key={lineIndex} className="flex items-start gap-2 my-1">
          <span className="text-niftek-dark mt-1 flex-shrink-0">•</span>
          <span>{listContent}</span>
        </div>
      );
      return;
    }

    // Regular line with potential bold text
    if (line.trim()) {
      const lineContent = parseBoldText(line);
      result.push(
        <React.Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {lineContent}
        </React.Fragment>
      );
    } else {
      // Empty line
      result.push(
        <React.Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {'\u00A0'}
        </React.Fragment>
      );
    }
  });

  return result;
};

// Helper function to parse bold text (**text**)
const parseBoldText = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the bold text
    parts.push(
      <strong key={key++} className="font-semibold">
        {match[1]}
      </strong>
    );
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type Student = {
  id?: number;
  name?: string;
  [key: string]: any; // Allow for other fields from API
};

type StudentDetails = {
  id?: number;
  name?: string;
  messages?: Array<{
    role?: string;
    content?: string;
    text?: string;
    from?: string;
    timestamp?: string;
    created_at?: string;
  }>;
  [key: string]: any;
};

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<StudentDetails | null>(null);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingStudentDetails, setIsLoadingStudentDetails] = useState(false);
  const [conversationState, setConversationState] = useState<{
    conversation_id?: number;
    search_request_draft_id?: number;
    search_request_id?: number;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasVerifiedAuth = useRef(false);

  // Verify authentication on mount
  useEffect(() => {
    if (hasVerifiedAuth.current) return;

    const verifyAuthentication = async () => {
      if (typeof window === "undefined") return;

      hasVerifiedAuth.current = true;
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(AUTH_ME_URL, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("advisor_authenticated");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("advisor_authenticated", "true");
        }

        setIsVerifyingAuth(false);
      } catch (err) {
        console.error("Auth verification error:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("advisor_authenticated");
        localStorage.removeItem("user");
        router.push("/login");
      }
    };

    verifyAuthentication();
  }, [router]);

  // Fetch students after authentication
  useEffect(() => {
    if (isVerifyingAuth) return;

    const fetchStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) return;

        const response = await fetch(ALL_STUDENTS_URL, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        // Handle both array and object with array property
        const studentsList = Array.isArray(data) ? data : data.students || data.data || [];
        setStudents(studentsList);
        
        // Select first student if available
        if (studentsList.length > 0 && studentsList[0].id) {
          setSelectedStudentId(studentsList[0].id);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [isVerifyingAuth]);

  // Fetch student details and message history when student is selected
  useEffect(() => {
    if (!selectedStudentId || isVerifyingAuth) return;

    const fetchStudentDetails = async () => {
      setIsLoadingStudentDetails(true);
      setMessages([]); // Clear current messages while loading

      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          router.push("/login");
          return;
        }

        const response = await fetch(getStudentByIdUrl(selectedStudentId), {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }

        const data = await response.json();
        console.log("Student details response:", data);
        
        // Handle new response format with result1 and message
        if (data.result1) {
          setSelectedStudentDetails(data.result1);
        } else {
          setSelectedStudentDetails(data);
        }

        // Parse and display message history
        // Handle both 'message' (singular) and 'messages' (plural) from API
        const messagesArray = data.message || data.messages;
        console.log("Messages array from API:", messagesArray);
        
        if (messagesArray && Array.isArray(messagesArray)) {
          const parsedMessages: Message[] = messagesArray
            .filter((msg: any) => {
              // Filter out empty messages
              const content = msg.message || msg.content || msg.text || "";
              const hasContent = content.trim() !== "";
              console.log("Message:", msg, "Has content:", hasContent);
              return hasContent;
            })
            .map((msg: any) => {
              // Handle different message formats from API
              const role = msg.role || (msg.from === "advisor" || msg.from === "user" ? "user" : "assistant");
              const content = msg.message || msg.content || msg.text || "";
              const timestamp = msg.timestamp || msg.created_at || new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const mappedRole = role === "user" || role === "advisor" ? "user" : "assistant";
              console.log("Parsing message - Original role:", role, "Mapped role:", mappedRole, "Content:", content);
              
              return {
                role: mappedRole,
                content,
                timestamp: typeof timestamp === "string" ? timestamp : new Date(timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };
            });

          console.log("Parsed messages:", parsedMessages);
          setMessages(parsedMessages);
        } else {
          // If no messages array, try to find messages in other formats
          const messageKeys = Object.keys(data).filter(key => 
            key.toLowerCase().includes("message") || 
            key.toLowerCase().includes("chat") ||
            key.toLowerCase().includes("history")
          );
          
          if (messageKeys.length > 0) {
            const messageData = data[messageKeys[0]];
            if (Array.isArray(messageData)) {
              const parsedMessages: Message[] = messageData
                .filter((msg: any) => {
                  const content = msg.message || msg.content || msg.text || "";
                  return content.trim() !== "";
                })
                .map((msg: any) => ({
                  role: (msg.role === "advisor" || msg.role === "user") ? "user" : "assistant",
                  content: msg.message || msg.content || msg.text || "",
                  timestamp: msg.timestamp || new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                }));
              setMessages(parsedMessages);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching student details:", err);
        setMessages([]);
      } finally {
        setIsLoadingStudentDetails(false);
      }
    };

    fetchStudentDetails();
  }, [selectedStudentId, isVerifyingAuth, router]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
    setSelectedStudentId(null);
    setSelectedStudentDetails(null);
    setMessages([]);
    setConversationState({});
    setMessageInput("");
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSendingMessage || !selectedStudentId) return;

    const userQuery = messageInput.trim();
    setMessageInput("");
    setIsSendingMessage(true);

    // Add user message to UI immediately
    const userMessage: Message = {
      role: "user",
      content: userQuery,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        router.push("/login");
        return;
      }

      // Build conversation array for API
      const conversation = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Prepare payload
      const payload: {
        user_query: string;
        conversation: Array<{ role: string; content: string }>;
        system_prompt: string;
        conversation_id: number;
        search_request_draft_id?: number;
        search_request_id?: number;
      } = {
        user_query: userQuery,
        conversation: conversation,
        system_prompt: "",
        conversation_id: selectedStudentId || 0,
      };

      // Add conversation state if available
      if (conversationState.search_request_draft_id) {
        payload.search_request_draft_id = conversationState.search_request_draft_id;
      }
      if (conversationState.search_request_id) {
        payload.search_request_id = conversationState.search_request_id;
      }

      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to send message");
      }

      // Extract assistant response
      const assistantResponse =
        data.response ||
        data.message ||
        data.content ||
        data.answer ||
        data.text ||
        "";

      if (assistantResponse) {
        const assistantMessage: Message = {
          role: "assistant",
          content: assistantResponse,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update conversation state if provided in response
        if (data.conversation_id) {
          setConversationState((prev) => ({
            ...prev,
            conversation_id: data.conversation_id,
          }));
        }
        if (data.search_request_draft_id) {
          setConversationState((prev) => ({
            ...prev,
            search_request_draft_id: data.search_request_draft_id,
          }));
        }
        if (data.search_request_id) {
          setConversationState((prev) => ({
            ...prev,
            search_request_id: data.search_request_id,
          }));
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("advisor_authenticated");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Show loading state while verifying authentication
  if (isVerifyingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-niftek-white">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-niftek-medium border-r-transparent"></div>
          <p className="text-niftek-dark/70">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const displayStudent = selectedStudentDetails || selectedStudent;

  return (
    <div className="flex min-h-screen bg-niftek-white">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-72 flex-shrink-0 border-r border-niftek-light bg-niftek-white overflow-y-auto">
        <div className="flex h-full flex-col">
          <div className="border-b border-niftek-light px-4 py-4">
            <h2 className="text-lg font-bold text-niftek-dark">Students</h2>
            <p className="mt-1 text-xs text-niftek-dark/70">
              {students.length} {students.length === 1 ? "student" : "students"}
          </p>
        </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {isLoadingStudents ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-niftek-medium border-t-transparent"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-niftek-dark/70">No students found</p>
        </div>
            ) : (
              <div className="space-y-1">
                {students.map((student) => {
                  const firstName = student.first_name || "";
                  const lastName = student.last_name || "";
                  const fullName = `${firstName} ${lastName}`.trim() || "Unknown Student";
                  const grade = student.grade || "";
                  const initial = firstName.charAt(0).toUpperCase() || "?";
                  
                  return (
        <button
                      key={student.id || Math.random()}
          onClick={() => {
                        setSelectedStudentId(student.id || null);
                      }}
                        className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                          selectedStudentId === student.id
                            ? "bg-gray-200 text-niftek-dark border border-niftek-medium/40"
                            : "text-niftek-dark hover:bg-niftek-offwhite hover:text-niftek-dark"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                            selectedStudentId === student.id
                              ? "bg-niftek-medium text-niftek-white"
                              : "bg-niftek-light text-niftek-dark"
                          }`}
                        >
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="truncate block font-medium">
                            {fullName}
                          </span>
                          {grade && (
                            <span className="text-xs text-niftek-dark/70 truncate block">
                              Grade {grade}
                            </span>
                          )}
                        </div>
                      </div>
        </button>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* New Chat Button at Bottom */}
          <div className="border-t border-niftek-light px-4 py-4">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-niftek-medium text-niftek-white hover:bg-niftek-medium/90 transition shadow-md hover:shadow-lg px-4 py-3"
              aria-label="New Chat"
              title="Start New Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">New Chat</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-niftek-light bg-niftek-white px-4 py-4 shadow-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
              <h1 className="text-xl font-bold text-niftek-dark">AI Advisor Assistant</h1>
              {displayStudent ? (
                <p className="mt-1 text-sm text-niftek-dark/70">
                  About: {
                    displayStudent.first_name && displayStudent.last_name
                      ? `${displayStudent.first_name} ${displayStudent.last_name}`
                      : displayStudent.name || "Student"
                  }
                </p>
              ) : (
                <p className="mt-1 text-sm text-niftek-dark/70">
                  Start a new conversation 
                </p>
              )}
          </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-niftek-light bg-niftek-white px-4 py-2 text-sm font-medium text-niftek-dark transition hover:bg-niftek-offwhite hover:text-niftek-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-niftek-white px-4 py-6">
          <div className="mx-auto max-w-4xl space-y-4">
          {isLoadingStudentDetails ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-niftek-medium border-r-transparent"></div>
              <p className="text-sm text-niftek-dark/70">Loading student information...</p>
            </div>
          ) : messages.length === 0 && !isLoadingStudentDetails ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-niftek-light/50 p-4">
                <svg
                  className="h-8 w-8 text-niftek-medium"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-niftek-dark">
                Start a conversation
              </h2>
              <p className="text-sm text-niftek-dark/70">
                Ask me anything and I'll help you out
              </p>
            </div>
          ) : null}

          {messages
            .filter((message) => message.content && message.content.trim() !== "")
            .map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-niftek-medium text-niftek-white"
                    : "bg-niftek-offwhite text-niftek-dark border border-niftek-light"
                }`}
              >
                <p className="text-xs font-semibold mb-1 opacity-80">
                  {message.role === "user" ? "Advisor" : "AI Assistant"}
                </p>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.role === "assistant" ? parseMarkdown(message.content) : message.content}
                </div>
                <p
                  className={`mt-1 text-xs ${
                    message.role === "user"
                      ? "text-niftek-white/80"
                      : "text-niftek-dark/70"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}

          {isSendingMessage && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-niftek-offwhite border border-niftek-light px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-niftek-medium"></div>
                  <div
                    className="h-2 w-2 animate-pulse rounded-full bg-niftek-medium"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-pulse rounded-full bg-niftek-medium"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
          </div>
        </div>
            </div>
          )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <footer className="sticky bottom-0 border-t border-niftek-light bg-niftek-white px-4 py-4">
          <div className="mx-auto max-w-4xl">
          <div className="flex gap-3">
            <textarea
              rows={1}
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                // Auto-resize textarea
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 resize-none rounded-xl border border-niftek-light bg-niftek-white px-4 py-3 text-sm text-niftek-dark placeholder:text-niftek-dark/50 focus:border-niftek-medium focus:outline-none focus:ring-2 focus:ring-niftek-medium/30"
              disabled={isSendingMessage}
            />
              <button
              type="button"
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isSendingMessage}
              className="rounded-xl bg-niftek-medium px-6 py-3 text-sm font-semibold text-niftek-white shadow-lg shadow-niftek-medium/30 transition hover:bg-niftek-medium/90 hover:shadow-xl hover:shadow-niftek-medium/40 focus:outline-none focus:ring-2 focus:ring-niftek-medium focus:ring-offset-2 focus:ring-offset-niftek-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSendingMessage ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
              </button>
          </div>
        </div>
        </footer>
      </div>
    </div>
  );
}
