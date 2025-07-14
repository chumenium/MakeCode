class StringGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadHistory();
    }

    initializeElements() {
        this.lengthInput = document.getElementById('length');
        this.uppercaseCheckbox = document.getElementById('uppercase');
        this.lowercaseCheckbox = document.getElementById('lowercase');
        this.numbersCheckbox = document.getElementById('numbers');
        this.symbolsCheckbox = document.getElementById('symbols');
        this.generateButton = document.getElementById('generate');
        this.resultTextarea = document.getElementById('result');
        this.copyButton = document.getElementById('copy');
        this.historyList = document.getElementById('history-list');
    }

    bindEvents() {
        this.generateButton.addEventListener('click', () => this.generateString());
        this.copyButton.addEventListener('click', () => this.copyToClipboard());
        
        // Enterキーで生成
        this.lengthInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateString();
            }
        });
    }

    generateString() {
        const length = parseInt(this.lengthInput.value);
        
        if (length < 1 || length > 1000) {
            alert('文字数は1から1000の間で入力してください。');
            return;
        }

        const options = {
            uppercase: this.uppercaseCheckbox.checked,
            lowercase: this.lowercaseCheckbox.checked,
            numbers: this.numbersCheckbox.checked,
            symbols: this.symbolsCheckbox.checked
        };

        // 少なくとも1つのオプションが選択されているかチェック
        if (!Object.values(options).some(option => option)) {
            alert('少なくとも1つの文字タイプを選択してください。');
            return;
        }

        const generatedString = this.createRandomString(length, options);
        this.resultTextarea.value = generatedString;
        
        // 履歴に追加
        this.addToHistory(generatedString, length, options);
    }

    createRandomString(length, options) {
        let chars = '';
        
        if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (options.numbers) chars += '0123456789';
        if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    copyToClipboard() {
        if (this.resultTextarea.value) {
            this.resultTextarea.select();
            document.execCommand('copy');
            
            // コピー成功のフィードバック
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = 'コピー完了！';
            this.copyButton.style.background = '#28a745';
            
            setTimeout(() => {
                this.copyButton.textContent = originalText;
                this.copyButton.style.background = '#28a745';
            }, 2000);
        }
    }

    addToHistory(text, length, options) {
        const historyItem = {
            text: text,
            length: length,
            options: options,
            timestamp: new Date().toLocaleString('ja-JP')
        };

        // ローカルストレージから履歴を取得
        let history = JSON.parse(localStorage.getItem('stringGeneratorHistory') || '[]');
        
        // 新しいアイテムを先頭に追加
        history.unshift(historyItem);
        
        // 履歴を最大20件に制限
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        // ローカルストレージに保存
        localStorage.setItem('stringGeneratorHistory', JSON.stringify(history));
        
        // 履歴を表示
        this.displayHistory();
    }

    loadHistory() {
        this.displayHistory();
    }

    displayHistory() {
        const history = JSON.parse(localStorage.getItem('stringGeneratorHistory') || '[]');
        
        if (history.length === 0) {
            this.historyList.innerHTML = '<p style="color: #666; text-align: center;">履歴がありません</p>';
            return;
        }

        this.historyList.innerHTML = history.map(item => {
            const optionsText = this.getOptionsText(item.options);
            return `
                <div class="history-item">
                    <div class="text">${item.text}</div>
                    <div class="info">
                        ${item.length}文字 | ${optionsText} | ${item.timestamp}
                    </div>
                </div>
            `;
        }).join('');
    }

    getOptionsText(options) {
        const parts = [];
        if (options.uppercase) parts.push('大文字');
        if (options.lowercase) parts.push('小文字');
        if (options.numbers) parts.push('数字');
        if (options.symbols) parts.push('記号');
        return parts.join(', ');
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new StringGenerator();
}); 