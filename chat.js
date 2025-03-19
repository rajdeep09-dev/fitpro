// Chat bot functionality

document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    
    if (!chatToggle || !chatWindow) return;
    
    let isOpen = false;
    let isMinimized = false;
    let hasUnreadMessages = false;
    let isAgent = false;
    
    // Chat messages
    let messages = [];
    
    // Predefined FAQs
    const faqs = [
        {
            question: "How do I choose the right fitness plan?",
            answer: "The best plan depends on your goals, fitness level, and budget. Our One-on-One Plan offers personalized guidance, while our Workout Plan is great for self-motivated individuals. Feel free to contact us for a recommendation."
        },
        {
            question: "How are the plans delivered?",
            answer: "All plans are delivered digitally through our app and email. You'll receive detailed workout instructions, videos, meal plans, and tracking tools depending on your chosen plan."
        },
        {
            question: "Can I upgrade my plan later?",
            answer: "Yes! You can upgrade to a more comprehensive plan at any time. We'll even prorate the cost based on your current subscription."
        },
        {
            question: "How long until I see results?",
            answer: "Results vary based on your starting point, consistency, and plan. Most clients see noticeable changes within 4-6 weeks when following our programs consistently."
        },
        {
            question: "Do I need gym equipment?",
            answer: "It depends on your chosen plan. We offer options for home workouts with minimal equipment as well as gym-based routines. We'll tailor the plan to the equipment you have access to."
        }
    ];
    
    // Initialize chat window
    function initChatWindow() {
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-icon">
                        <i class="fas fa-dumbbell"></i>
                    </div>
                    <div>
                        <h3 class="chat-title">FitPro Assistant</h3>
                        <p class="chat-status">Online | Ask me anything</p>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button id="chat-minimize" class="chat-btn">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button id="chat-close" class="chat-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="chat-tabs">
                <button id="tab-chat" class="chat-tab active">Chat</button>
                <button id="tab-faq" class="chat-tab">FAQs</button>
                <button id="tab-contact" class="chat-tab">Contact</button>
            </div>
            
            <div id="chat-content" class="chat-content">
                <div id="chat-messages" class="chat-messages"></div>
                <div id="typing-indicator" class="typing-indicator hidden">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
            
            <form id="chat-form" class="chat-form">
                <input type="text" id="chat-input" placeholder="Type your message..." />
                <button type="submit" class="chat-send-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </form>
            
            <div id="faq-content" class="faq-content hidden">
                <p class="faq-intro">Frequently Asked Questions</p>
                <div id="faq-list" class="faq-list"></div>
            </div>
            
            <div id="contact-content" class="contact-content hidden">
                <p class="contact-intro">Get in touch with us</p>
                <div class="contact-options">
                    <a href="tel:+919876543210" class="contact-option-item">
                        <div class="contact-option-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="contact-option-details">
                            <p class="contact-option-title">Call Us</p>
                            <p class="contact-option-subtitle">+91 98765 43210</p>
                        </div>
                    </a>
                    
                    <a href="https://wa.me/919876543210" class="contact-option-item">
                        <div class="contact-option-icon">
                            <i class="fab fa-whatsapp"></i>
                        </div>
                        <div class="contact-option-details">
                            <p class="contact-option-title">WhatsApp</p>
                            <p class="contact-option-subtitle">+91 98765 43210</p>
                        </div>
                    </a>
                    
                    <div class="contact-option-item">
                        <div class="contact-option-icon">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <div class="contact-option-details">
                            <p class="contact-option-title">Book a Consultation</p>
                            <p class="contact-option-subtitle">Free 10-minute call</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles to chat window
        const style = document.createElement('style');
        style.textContent = `
            .chat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background-color: #111;
                border-bottom: 1px solid var(--border);
            }
            
            .chat-header-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .chat-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: rgba(193, 255, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary);
            }
            
            .chat-title {
                font-size: 14px;
                font-weight: 600;
                margin: 0;
            }
            
            .chat-status {
                font-size: 12px;
                color: var(--muted-foreground);
                margin: 0;
            }
            
            .chat-header-actions {
                display: flex;
                gap: 5px;
            }
            
            .chat-btn {
                background: none;
                border: none;
                color: var(--foreground);
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            
            .chat-btn:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .chat-tabs {
                display: flex;
                border-bottom: 1px solid var(--border);
            }
            
            .chat-tab {
                flex: 1;
                padding: 8px;
                background: none;
                border: none;
                color: var(--muted-foreground);
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
            }
            
            .chat-tab.active {
                color: var(--primary);
                border-bottom: 2px solid var(--primary);
            }
            
            .chat-content {
                height: 280px;
                overflow-y: auto;
                padding: 12px;
            }
            
            .chat-messages {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .message {
                max-width: 80%;
                padding: 10px;
                border-radius: 12px;
                position: relative;
            }
            
            .message-user {
                background-color: var(--primary);
                color: var(--primary-foreground);
                align-self: flex-end;
            }
            
            .message-bot {
                background-color: #222;
                color: var(--foreground);
                align-self: flex-start;
            }
            
            .message-time {
                font-size: 10px;
                opacity: 0.7;
                margin-top: 4px;
            }
            
            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 10px;
                background-color: #222;
                border-radius: 12px;
                width: fit-content;
                margin-top: 10px;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background-color: var(--muted-foreground);
                border-radius: 50%;
                animation: typing-animation 1s infinite;
            }
            
            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typing-animation {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            
            .chat-form {
                display: flex;
                padding: 12px;
                border-top: 1px solid var(--border);
            }
            
            #chat-input {
                flex: 1;
                padding: 8px 12px;
                border-radius: 20px;
                border: 1px solid var(--border);
                background-color: #222;
                color: var(--foreground);
            }
            
            .chat-send-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: var(--primary);
                color: var(--primary-foreground);
                border: none;
                margin-left: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            
            .faq-content, .contact-content {
                height: 280px;
                overflow-y: auto;
                padding: 12px;
            }
            
            .faq-intro, .contact-intro {
                font-size: 12px;
                color: var(--muted-foreground);
                margin-bottom: 12px;
            }
            
            .faq-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .faq-item {
                padding: 10px;
                border-radius: 8px;
                border: 1px solid var(--border);
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .faq-item:hover {
                background-color: #222;
            }
            
            .faq-question {
                font-size: 13px;
                font-weight: 500;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .faq-question i {
                color: var(--primary);
                margin-right: 8px;
            }
            
            .contact-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .contact-option-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid var(--border);
                transition: background-color 0.2s;
            }
            
            .contact-option-item:hover {
                background-color: #222;
            }
            
            .contact-option-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: rgba(193, 255, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary);
            }
            
            .contact-option-title {
                font-size: 13px;
                font-weight: 500;
                margin: 0;
            }
            
            .contact-option-subtitle {
                font-size: 12px;
                color: var(--muted-foreground);
                margin: 0;
            }
            
            .hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        // Add event listeners
        document.getElementById('chat-minimize').addEventListener('click', toggleMinimize);
        document.getElementById('chat-close').addEventListener('click', closeChat);
        document.getElementById('chat-form').addEventListener('submit', handleSubmit);
        
        // Tab switching
        document.getElementById('tab-chat').addEventListener('click', () => switchTab('chat'));
        document.getElementById('tab-faq').addEventListener('click', () => switchTab('faq'));
        document.getElementById('tab-contact').addEventListener('click', () => switchTab('contact'));
        
        // Populate FAQs
        const faqList = document.getElementById('faq-list');
        faqs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <div class="faq-question">
                    <span><i class="fas fa-question-circle"></i> ${faq.question}</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;
            faqItem.addEventListener('click', () => handleFaqClick(faq));
            faqList.appendChild(faqItem);
        });
        
        // Add welcome message
        setTimeout(() => {
            addMessage({
                content: "👋 Hi there! I'm your FitPro assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date()
            });
        }, 500);
    }
    
    // Toggle chat window
    function toggleChat() {
        if (!isOpen) {
            isOpen = true;
            isMinimized = false;
            hasUnreadMessages = false;
            chatWindow.classList.remove('hidden');
            
            // Initialize chat window if first open
            if (chatWindow.innerHTML === '') {
                initChatWindow();
            }
        } else {
            if (isMinimized) {
                isMinimized = false;
                hasUnreadMessages = false;
                chatWindow.style.height = '400px';
                document.getElementById('chat-minimize').innerHTML = '<i class="fas fa-chevron-down"></i>';
            } else {
                isMinimized = true;
                chatWindow.style.height = '60px';
                document.getElementById('chat-minimize').innerHTML = '<i class="fas fa-chevron-up"></i>';
            }
        }
    }
    
    // Toggle minimize state
    function toggleMinimize() {
        if (isMinimized) {
            isMinimized = false;
            hasUnreadMessages = false;
            chatWindow.style.height = '400px';
            document.getElementById('chat-minimize').innerHTML = '<i class="fas fa-chevron-down"></i>';
            
            // Show content based on active tab
            const activeTab = document.querySelector('.chat-tab.active').id.split('-')[1];
            showTabContent(activeTab);
        } else {
            isMinimized = true;
            chatWindow.style.height = '60px';
            document.getElementById('chat-minimize').innerHTML = '<i class="fas fa-chevron-up"></i>';
            
            // Hide all content
            document.getElementById('chat-content').classList.add('hidden');
            document.getElementById('faq-content').classList.add('hidden');
            document.getElementById('contact-content').classList.add('hidden');
            document.getElementById('chat-form').classList.add('hidden');
        }
    }
    
    // Close chat
    function closeChat() {
        isOpen = false;
        isMinimized = false;
        chatWindow.classList.add('hidden');
    }
    
    // Switch between tabs
    function switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.chat-tab').forEach(el => el.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
        
        if (!isMinimized) {
            showTabContent(tab);
        }
    }
    
    // Show content based on active tab
    function showTabContent(tab) {
        // Hide all content
        document.getElementById('chat-content').classList.add('hidden');
        document.getElementById('faq-content').classList.add('hidden');
        document.getElementById('contact-content').classList.add('hidden');
        
        // Show form only for chat tab
        document.getElementById('chat-form').classList.toggle('hidden', tab !== 'chat');
        
        // Show selected tab content
        document.getElementById(`${tab}-content`).classList.remove('hidden');
    }
    
    // Add a message to the chat
    function addMessage(message) {
        messages.push(message);
        
        const chatMessages = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${message.sender}`;
        
        messageEl.innerHTML = `
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        
        chatMessages.appendChild(messageEl);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Set unread indicator if minimized
        if (isMinimized && message.sender === 'bot') {
            hasUnreadMessages = true;
            const unreadIndicator = document.createElement('span');
            unreadIndicator.className = 'unread-indicator';
            chatToggle.appendChild(unreadIndicator);
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        document.getElementById('typing-indicator').classList.remove('hidden');
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        document.getElementById('typing-indicator').classList.add('hidden');
    }
    
    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        
        const input