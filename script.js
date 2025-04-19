class QRClock {
    constructor() {
        this.timeElement = document.getElementById('current-time');
        this.gpsElement = document.getElementById('gps-info');
        this.qrElement = document.getElementById('qrcode');
        this.lastPosition = null;
        
        // QRコードの初期設定
        this.qr = new QRCode(this.qrElement, {
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        this.init();
    }

    init() {
        this.startClock();
        this.startGPS();
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toISOString();
            
            // 現在時刻の表示を更新
            this.timeElement.textContent = now.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3
            });

            // QRコードデータの作成
            const qrData = {
                timestamp: now.getTime(),
                gps: this.lastPosition
            };

            // QRコードの更新
            this.qr.makeCode(JSON.stringify(qrData));

            // 約16.6ms（60fps）ごとに更新
            requestAnimationFrame(updateClock);
        };

        updateClock();
    }

    startGPS() {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (position) => {
                    this.lastPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    
                    // GPS情報の表示を更新
                    this.gpsElement.textContent = `GPS: ${this.lastPosition.latitude.toFixed(6)}, ${this.lastPosition.longitude.toFixed(6)} (精度: ${this.lastPosition.accuracy.toFixed(1)}m)`;
                },
                (error) => {
                    console.error('GPS error:', error);
                    this.gpsElement.textContent = 'GPS: 取得できません';
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
        } else {
            this.gpsElement.textContent = 'GPS: このブラウザではサポートされていません';
        }
    }
}

// アプリケーションの起動
document.addEventListener('DOMContentLoaded', () => {
    new QRClock();
});