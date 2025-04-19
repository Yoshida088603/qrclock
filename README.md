# QR Clock with GPS

リアルタイムで時刻とGPS位置情報をQRコードとして表示するWebアプリケーションです。

## 機能

- ミリ秒単位でのリアルタイム時刻表示
- 時刻情報とGPS座標を含むQRコードの動的生成
- GPS位置情報のリアルタイム取得と表示
- 60FPSでの表示更新

## 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)
- [qrcodejs](https://github.com/davidshimjs/qrcodejs) - QRコード生成ライブラリ
- Geolocation API

## セットアップと実行方法

1. リポジトリをクローン：
```bash
git clone [リポジトリURL]
cd qrclock
```

2. ローカルサーバーの起動（以下のいずれかを使用）：

Pythonの場合：
```bash
python -m http.server 8000
```

Node.jsの場合：
```bash
npx serve
```

3. ブラウザでアクセス：
