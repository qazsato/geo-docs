<a href="https://docs.geo.qazsato.com" target="_blank">
  <img src="./client/assets/images/logo.svg" alt="Geo API" width="250px">
</a>

## 本リポジトリについて

国土交通省と総務省が公開している、住所や地域メッシュといった地理情報を元にした API 群のドキュメントです。
主に GIS による分析での利用を想定しています。

ドキュメントは下記から閲覧できます。
https://docs.geo.qazsato.com

## セットアップ

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
