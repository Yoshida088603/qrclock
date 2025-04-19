# QR Clock

QRコードを使用してGPS時刻を表示・共有するWebアプリケーション。

[デモを見る](https://[username].github.io/qrclock/)

## 機能

- UTC時刻の表示（YYYY-MM-DD HH:MM:SS.mmm形式）
- GPS時刻の表示（1980年1月6日からの経過ミリ秒）
- GPS時刻のQRコード化
- 更新レート: 5-16fps（設定可能）

## 実装詳細

### 時刻表示
- UTC: ISO 8601形式（YYYY-MM-DD HH:MM:SS.mmm）
- GPS: 1980年1月6日 00:00:00 UTCからの経過ミリ秒

### QRコード
- 内容: GPS時刻（経過ミリ秒）
- サイズ: 256x256ピクセル
- 誤り訂正レベル: H（高）

### 更新レート
- デフォルト: 16fps（62.5ms間隔）
- 設定可能範囲: 5-16fps
  - 5fps = 200ms間隔
  - 10fps = 100ms間隔
  - 16fps = 62.5ms間隔

## ローカルでの実行

1. リポジトリをクローン:
```bash
git clone https://github.com/[username]/qrclock.git
cd qrclock
```

2. ローカルサーバーの起動:
```bash
# Pythonの場合
python -m http.server 8000

# Node.jsの場合
npx serve
```

3. ブラウザでアクセス:
```
http://localhost:8000
```

## 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)
- QRコード生成: qrcodejs
- 時刻処理: 標準のDate API

## 注意事項

- ブラウザのJavaScript実行環境での時刻精度には限界があります
- システム時計の精度に依存します
- より正確な時刻同期が必要な場合は、専用のNTPまたはGPS受信機の使用を推奨します

#current-time {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    line-height: 1.5;
}

#gps-info {
    font-size: 0.9rem;
    color: #666;
    margin-top: 1rem;
    font-style: italic;
}

class QRClock {
    constructor() {
        this.timeElement = document.getElementById('current-time');
        this.qrElement = document.getElementById('qrcode');
        this.infoElement = document.getElementById('gps-info');
        
        // GPS時間とUTC時間の差（2024年現在）
        this.GPS_UTC_OFFSET = 18; // 秒
        this.GPS_EPOCH_OFFSET = 315964800000; // 1980年1月6日からのミリ秒

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

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const utcTimestamp = now.getTime();
            const gpsTimestamp = utcTimestamp + (this.GPS_UTC_OFFSET * 1000);

            // 画面表示用の時刻フォーマット
            const utcTime = now.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3
            });

            const gpsTime = new Date(gpsTimestamp).toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3
            });

            this.timeElement.innerHTML = `UTC: ${utcTime}<br>GPS: ${gpsTime}`;

            // QRコードにはGPS時刻のみを含める
            this.qr.makeCode(gpsTimestamp.toString());

            requestAnimationFrame(updateClock);
        };

        updateClock();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QRClock();
});
