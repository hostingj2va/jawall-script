// Jawall Ultimate Resource Blocker v4.0 - 100% Network & CSS Defense
(function() {
    'use strict';
    
    // ===== NUCLEAR NETWORK BLOCKADE =====
    const blockedPatterns = [
        '/pic/', '/upload', '.png', '.jpg', '.jpeg', 
        '.gif', '.webp', '.mp4', '.webm', '.avi',
        '/jquery.tablesorter.min.js', '/jscolor/jscolor.js',
        '7IWnr.webp', 'uU3AN.webp' // Specific blocked images
    ];
    
    // WebSocket Terminator
    const nativeWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        if (url.includes('socket.io') && url.includes('transport=websocket')) {
            console.log(`[📡🚫] WEBSOCKET TERMINATED: ${url.split('?')[0]}`);
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
        // Allow the script itself to be fetched
        if (url.includes('fasterjava.wuaze.com/jawall.js')) {
            return nativeFetch(resource, init);
        }
        if (blockedPatterns.some(p => url.includes(p))) {
            console.log(`[🌐🚫] FETCH ANNIHILATED: ${url.substring(0, 45)}${url.length > 45 ? '...' : ''}`);
            return Promise.reject(new Error('Jawall Security Blockade'));
        }
        return nativeFetch(resource, init);
    };
    
    // XHR Destroyer
    const nativeXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends nativeXHR {
        open(method, url) {
            // Allow the script itself to be fetched via XHR
            if (url.includes('fasterjava.wuaze.com/jawall.js')) {
                super.open(method, url);
                return;
            }
            if (blockedPatterns.some(p => url.includes(p))) {
                this._blocked = true;
                console.log(`[🌐🚫] XHR DESTROYED: ${method} ${url.substring(0, 40)}${url.length > 40 ? '...' : ''}`);
                return;
            }
            super.open(method, url);
        }
        send(body) {
            if (this._blocked) return;
            super.send(body);
        }
    };
    
    // ===== CSS IMAGE EXTERMINATOR =====
    const nukeCSSImages = () => {
        // 1. Destroy background images
        document.querySelectorAll('*').forEach(el => {
            const bgImage = getComputedStyle(el).backgroundImage;
            if (bgImage && bgImage !== 'none' && blockedPatterns.some(p => bgImage.includes(p))) {
                el.style.backgroundImage = 'none !important';
                el.style.backgroundColor = '#f0f0f0 !important';
                console.log(`[🎨☢️] CSS BG NUKED: ${el.tagName}`);
            }
        });
        
        // 2. Block future CSS images
        const nativeSetProperty = CSSStyleDeclaration.prototype.setProperty;
        CSSStyleDeclaration.prototype.setProperty = function(prop, value) {
            if ((prop === 'background-image' || prop === 'background') && 
                blockedPatterns.some(p => value.includes(p))) {
                console.log(`[🎨🚫] CSS BLOCKED: ${value.substring(0, 45)}${value.length > 45 ? '...' : ''}`);
                return;
            }
            nativeSetProperty.call(this, prop, value);
        };
    };
    
    // ===== DOM NEUTRALIZATION ENGINE =====
    const activateDOMWarfare = () => {
        // 1. Eliminate all media elements
        document.querySelectorAll('img, video, audio, iframe').forEach(el => {
            const src = el.src || el.getAttribute('src') || '';
            // Allow the script itself to be fetched
            if (src.includes('fasterjava.wuaze.com/jawall.js')) {
                return;
            }
            if (src && blockedPatterns.some(p => src.includes(p))) {
                console.log(`[🔥 NUKED] ${el.tagName}: ${src.substring(0, 45)}${src.length > 45 ? '...' : ''}`);
                el.remove();
            }
        });
        
        // 2. Destroy CSS background images
        nukeCSSImages();
        
        // 3. Military-grade button disablement
        const wallButton = document.querySelector('button[onclick*="#wall"], button[data-target="#wall"]');
        if (wallButton) {
            // Create quantum lock
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
            
            // Visual transformation
            wallButton.style.cssText = `
                position: relative;
                opacity: 0.4 !important;
                filter: grayscale(100%) blur(0.5px) !important;
                pointer-events: none !important;
            `;
            
            // Event nullification matrix
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
            console.log('[🛡️] Wall button locked with quantum shield');
        }
    };
    
    // ===== PREDICTIVE DOM DEFENSE SYSTEM =====
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Block new elements
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    // Media elements
                    if (['IMG', 'VIDEO', 'AUDIO', 'IFRAME'].includes(node.tagName)) {
                        const src = node.src || node.getAttribute('src') || '';
                        // Allow the script itself to be fetched
                        if (src.includes('fasterjava.wuaze.com/jawall.js')) {
                            return;
                        }
                        if (src && blockedPatterns.some(p => src.includes(p))) {
                            node.remove();
                            console.log(`[⚡ PRE-EMPT] Removed ${node.tagName} element`);
                        }
                    }
                    
                    // CSS backgrounds
                    nukeCSSImages();
                    
                    // Buttons
                    if (node.matches('button[onclick*="#wall"], button[data-target="#wall"]') || 
                        node.querySelector('button[onclick*="#wall"], button[data-target="#wall"]')) {
                        setTimeout(activateDOMWarfare, 0);
                    }
                }
            });
            
            // Attribute changes
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                nukeCSSImages();
            }
        });
    });
    
    // ===== PRE-LOGIN ACTIVATION PROTOCOL =====
    const initializeBlockade = () => {
        activateDOMWarfare();
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'src']
        });
        
        // Nuclear option for image constructors
        const nativeImage = window.Image;
        window.Image = class BlockedImage extends nativeImage {
            constructor(width, height) {
                super(width, height);
                const proxy = new Proxy(this, {
                    set: (target, prop, value) => {
                        // Allow the script itself to be fetched
                        if (prop === 'src' && value.includes('fasterjava.wuaze.com/jawall.js')) {
                            target[prop] = value;
                            return true;
                        }
                        if (prop === 'src' && blockedPatterns.some(p => value.includes(p))) {
                            console.log(`[🚫] IMAGE CREATION BLOCKED: ${value.substring(0,45)}...`);
                            return true;
                        }
                        target[prop] = value;
                        return true;
                    }
                });
                return proxy;
            }
        };
    };
    
    // ===== EXECUTION =====
    // Immediate execution before DOM load
    initializeBlockade();
    
    // Run again after DOM loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBlockade);
    }
    
    // Continuous monitoring
    setInterval(() => {
        nukeCSSImages();
        activateDOMWarfare();
    }, 3000);
    
    console.log('%cJAWALL QUANTUM DEFENSE ENGAGED', 'font-size: 18px; background: linear-gradient(to right, #000, #d00); color: white; padding: 10px; border: 2px solid red;');
    console.log('✅ Network requests vaporized\n✅ CSS backgrounds annihilated\n✅ DOM manipulations neutralized');
})();

