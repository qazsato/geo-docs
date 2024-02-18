## 本リポジトリについて

[Geo API](https://github.com/qazsato/geo-api) の API 仕様書や利用方法をまとめたドキュメントです。

下記から閲覧できます。  
https://docs.geodig.jp

<a href="https://github.com/qazsato/geo-api" target="_blank">
  <img src="./client/assets/images/logo.svg" alt="Geo API" width="200px">
</a>

## ローカル環境

### セットアップ

.env を作成し、各 API キー情報を設定。

```
GOOGLE_MAPS_API_KEY={YOUR_API_KEY}
GEO_API_KEY={YOUR_API_KEY}
```

```bash
$ docker-compose build
$ docker-compose up -d
$ docker-compose exec geo_docs /bin/bash -c 'npm run dev:host'
```

http://localhost:3000 でアクセスして画面が表示されれば OK。

## データの出典

- 国土交通省国土数値情報ダウンロードサイト（https://nlftp.mlit.go.jp/index.html）
  - 「国土数値情報 行政区域データ, 位置参照情報」（国土交通省）を加工して作成
- 政府統計の総合窓口(e-Stat)（https://www.e-stat.go.jp/）
  - 「国勢調査」（総務省）を加工して作成
