class WhoDoesWhatApp {
    constructor() {
        this.names = [];
        this.isSpinning = false;
        this.wheelColors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD',
            '#00D2D3', '#FF9F43', '#10AC84', '#EE5A24',
            '#0984E3', '#6C5CE7', '#A29BFE', '#FD79A8'
        ];
        
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
    }
    
    initializeElements() {
        this.nameInput = document.getElementById('name-input');
        this.addNameBtn = document.getElementById('add-name');
        this.namesList = document.getElementById('names-list');
        this.spinBtn = document.getElementById('spin-btn');
        this.wheelInner = document.getElementById('wheel-inner');
        this.result = document.getElementById('result');
        this.actionSelect = document.getElementById('action-select');
    }
    
    bindEvents() {
        this.addNameBtn.addEventListener('click', () => this.addName());
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addName();
            }
        });
        this.spinBtn.addEventListener('click', () => this.spinWheel());
        
        // Auto-focus on name input
        this.nameInput.focus();
    }
    
    addName() {
        const name = this.nameInput.value.trim();
        
        if (name === '') {
            this.shakeInput();
            return;
        }
        
        if (this.names.includes(name)) {
            this.showMessage('Name already added!');
            return;
        }
        
        if (this.names.length >= 12) {
            this.showMessage('Maximum 12 people allowed!');
            return;
        }
        
        this.names.push(name);
        this.nameInput.value = '';
        this.nameInput.focus();
        
        this.updateNamesDisplay();
        this.updateWheel();
        this.updateUI();
    }
    
    removeName(name) {
        const index = this.names.indexOf(name);
        if (index > -1) {
            this.names.splice(index, 1);
            this.updateNamesDisplay();
            this.updateWheel();
            this.updateUI();
        }
    }
    
    updateNamesDisplay() {
        this.namesList.innerHTML = '';
        
        this.names.forEach(name => {
            const nameTag = document.createElement('div');
            nameTag.className = 'name-tag';
            nameTag.innerHTML = `
                <span>${name}</span>
                <button class="remove-name" onclick="app.removeName('${name}')">×</button>
            `;
            this.namesList.appendChild(nameTag);
        });
    }
    
    updateWheel() {
        this.wheelInner.innerHTML = '';
        
        if (this.names.length === 0) {
            this.wheelInner.style.background = '#f0f0f0';
            return;
        }
        
        const anglePerSegment = 360 / this.names.length;
        
        this.names.forEach((name, index) => {
            const segment = document.createElement('div');
            segment.className = 'wheel-segment';
            
            const rotation = index * anglePerSegment;
            const color = this.wheelColors[index % this.wheelColors.length];
            
            segment.style.background = color;
            segment.style.transform = `rotate(${rotation}deg) skewY(${90 - anglePerSegment}deg)`;
            
            // Adjust text size based on number of segments
            let fontSize = '0.9em';
            if (this.names.length > 8) fontSize = '0.7em';
            if (this.names.length > 10) fontSize = '0.6em';
            
            segment.style.fontSize = fontSize;
            
            // Create text container that counter-rotates the skew
            const textContainer = document.createElement('div');
            textContainer.style.transform = `skewY(${anglePerSegment - 90}deg) rotate(${anglePerSegment/2}deg)`;
            textContainer.style.height = '100%';
            textContainer.style.display = 'flex';
            textContainer.style.alignItems = 'center';
            textContainer.style.justifyContent = 'center';
            textContainer.textContent = name;
            
            segment.appendChild(textContainer);
            this.wheelInner.appendChild(segment);
        });
    }
    
    spinWheel() {
        if (this.isSpinning || this.names.length === 0) return;
        
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.result.textContent = '';
        this.result.className = 'result';
        
        // Clear previous result
        this.result.innerHTML = '<div style="animation: spin 1s linear infinite;">🎯</div>';
        
        // Reset wheel rotation first
        this.wheelInner.style.transition = 'none';
        this.wheelInner.style.transform = 'rotate(0deg)';
        
        // Force reflow
        this.wheelInner.offsetHeight;
        
        // Calculate random rotation (multiple full rotations + random position)
        const minSpins = 3;
        const maxSpins = 6;
        const randomSpins = Math.random() * (maxSpins - minSpins) + minSpins;
        const randomAngle = Math.random() * 360;
        const totalRotation = (randomSpins * 360) + randomAngle;
        
        // Apply rotation with animation
        setTimeout(() => {
            this.wheelInner.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
            this.wheelInner.style.transform = `rotate(${totalRotation}deg)`;
        }, 100);
        
        // Calculate which segment wins (accounting for pointer at top)
        setTimeout(() => {
            const normalizedAngle = (360 - (totalRotation % 360)) % 360;
            const segmentAngle = 360 / this.names.length;
            const winnerIndex = Math.floor(normalizedAngle / segmentAngle);
            const winner = this.names[winnerIndex];
            const action = this.actionSelect.value;
            
            this.showWinner(winner, action);
            
            this.isSpinning = false;
            this.spinBtn.disabled = false;
        }, 4200);
    }
    
    showWinner(winner, action) {
        this.result.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 1.2em; margin-bottom: 10px;">🎉 WINNER! 🎉</div>
                <div><strong>${winner}</strong> ${action}!</div>
            </div>
        `;
        this.result.className = 'result winner';
        
        // Add confetti effect
        this.createConfetti();
    }
    
    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '1000';
                confetti.style.animation = 'fall 3s linear forwards';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
    }
    
    updateUI() {
        this.spinBtn.disabled = this.names.length === 0;
        
        if (this.names.length === 0) {
            this.result.textContent = 'Add some names to get started! 👆';
            this.result.className = 'result';
        }
    }
    
    shakeInput() {
        this.nameInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            this.nameInput.style.animation = '';
        }, 500);
    }
    
    showMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: fadeInOut 2s forwards;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 2000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        20%, 80% { opacity: 1; }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WhoDoesWhatApp();
});