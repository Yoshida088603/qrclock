class QRClock {
    constructor() {
        this.timeElement = document.getElementById('current-time');
        this.qrElement = document.getElementById('qrcode');
        this.infoElement = document.getElementById('gps-info');
        
        // GPS時間の開始時点（1980-01-06T00:00:00Z）
        this.GPS_EPOCH = new Date('1980-01-06T00:00:00Z').getTime();
        
        // 更新間隔（16fps = 62.5ms）
        this.UPDATE_INTERVAL = 62.5;
        this.updateTimer = null;

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
        this.infoElement.textContent = 'QRコードをスキャンしてGPS時刻を取得できます';
    }

    formatDateTime(date) {
        return date.toISOString().replace('T', ' ').slice(0, -1);
    }

    updateClock() {
        const now = new Date();
        const utcTimestamp = now.getTime();
        
        // GPS時間（1980年1月6日からの経過ミリ秒）
        const gpsTime = utcTimestamp - this.GPS_EPOCH;

        // 画面表示
        this.timeElement.innerHTML = `UTC: ${this.formatDateTime(now)}\nGPS: ${gpsTime}`;

        // QRコードにGPS時間をそのまま含める
        this.qr.makeCode(gpsTime.toString());
    }

    setUpdateRate(fps) {
        // 既存のタイマーをクリア
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }

        // fpsを5-16の範囲に制限
        fps = Math.min(Math.max(fps, 5), 16);
        this.UPDATE_INTERVAL = 1000 / fps;

        // 新しいタイマーを開始
        this.updateTimer = setInterval(() => this.updateClock(), this.UPDATE_INTERVAL);
    }

    startClock() {
        // 初回更新
        this.updateClock();
        // 16fpsで開始
        this.setUpdateRate(16);
    }
}

// アプリケーションの起動
document.addEventListener('DOMContentLoaded', () => {
    const clock = new QRClock();
    // 必要に応じてレートを変更可能
    clock.setUpdateRate(5);  // 5fps (200ms間隔)
    clock.setUpdateRate(10); // 10fps (100ms間隔)
    clock.setUpdateRate(16); // 16fps (62.5ms間隔)
});