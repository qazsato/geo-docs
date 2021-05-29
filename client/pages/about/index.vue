<template>
  <Page>
    <template #header>
      <Header :title="title" />
    </template>
    <article class="markdown-body">
      <h2>API 認証手段</h2>
      <p>
        Geo API の利用にはアクセストークンが必要です。<br />
        下記のようにアクセストークンをクエリパラメータに含めることで API の利用が可能となります。
      </p>
      <pre><code>$ curl https://api.geo.qazsato.com/v1/addresses?access_token={ACCESS_TOKEN}</code></pre>
      <p>アクセストークンの発行をご希望の方は、開発者へお問い合わせください。</p>

      <h2>リクエスト制限</h2>
      <p>
        Geo API では<b>1時間で最大1,000回</b>までのリクエストが可能です。<br />
        またレスポンスには、リクエスト制限を示す下記のヘッダ情報が付与されます。
      </p>
      <pre><code>X-Rate-Limit-Limit: 1000 # 期間内でリクエストできる最大回数
X-Rate-Limit-Reset: 3000 # 次の期間が来るまでの秒数
X-Rate-Limit-Remaining: 100 # 次の期間までにリクエストできる回数</code></pre>
      <p>リクエスト回数は、<b>毎時00分00秒</b>のタイミングでリセットされます。</p>
      <h2>ステータスコード</h2>
      <p>Geo API が返却する HTTP ステータスコードは、下記の通りです。</p>
      <table>
        <thead>
          <tr>
            <th>HTTPステータスコード</th>
            <th>種別</th>
            <th>概要</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>200</td>
            <td>OK</td>
            <td>リクエスト成功</td>
          </tr>
          <tr>
            <td>400</td>
            <td>Bad Request</td>
            <td>リクエストパラメータに不備がある</td>
          </tr>
          <tr>
            <td>401</td>
            <td>Unauthorized</td>
            <td>アクセストークンが無効である</td>
          </tr>
          <tr>
            <td>404</td>
            <td>Not Found</td>
            <td>指定したパスが存在しない</td>
          </tr>
          <tr>
            <td>414</td>
            <td>URI Too Long</td>
            <td>リクエスト長の上限を超えている</td>
          </tr>
          <tr>
            <td>429</td>
            <td>Too Many Request</td>
            <td>期間内のリクエスト数を超過した</td>
          </tr>
          <tr>
            <td>500</td>
            <td>Internal Server Error</td>
            <td>サーバ内部で予期せぬエラーが発生した</td>
          </tr>
        </tbody>
      </table>
      <h2>リクエストパラメータ</h2>
      <h3>検索数 (limit, offset)</h3>
      <p>
        一覧を取得する API は、一度のリクエストで取得できる上限を <b>100</b> 件としています。<br />
        そのため上限以降のデータを取得する場合、 <b>limit</b>,
        <b>offset</b> パラメータを利用していただく必要があります。<br />
        例えば下記のようにすることで、以降のデータの取得が可能です。
      </p>
      <pre><code>GET /addresses?offset=100&limit=10 // 100 件目以降のデータを 10 件取得</code></pre>
      <p>
        また、API のレスポンスヘッダーには <b>X-Total-Count</b> が含まれており、リクエストに対する総件数が確認できます
      </p>
      <pre><code>GET /addresses?level=1 // 都道府県のデータを取得

=> X-Total-Count: 47 // リクエストに対する総件数</code></pre>
      <h3>並び順 (sort)</h3>
      <p>
        一覧を取得する API は、データの並び順を <b>sort</b> パラメータで指定可能です。<br />
        API 毎に定めているソートキーに対して、<b>「-」</b>(ハイフン)
        を先頭に付与するかどうかで昇順・降順の指定が可能です。<br />
        また、カンマ区切りで繋げることで複数のソートも可能です。
      </p>
      <pre><code>GET /addresses?sort=-code // コードの降順で取得する
GET /addresses?sort=level,-area // 住所レベルの小さい順で、面積が広い順に取得する</code></pre>
      <h2>レスポンスオブジェクト</h2>
      <h3>緯度経度の形式</h3>
      <p>Geo API で扱う緯度経度の形式は、 WGS84 (世界測地系) の 10 進数形式です。</p>
      <pre><code>{
  "location": {
    "lat": 35.68151,
    "lng": 139.76699
  }
}</code></pre>
      <h3>エラーレスポンス</h3>
      <p>
        Geo API でエラーが発生した場合、レスポンスにはエラーの概要を示す HTTP
        ステータスコードと共に、エラーの原因を特定できる情報を返却します。<br />
        フォーマットは下記のような形式となっており、エラー毎に一意に割り振られた code 、エラーの種別を示す type
        、エラーの説明を記した message で構成されています。
      </p>
      <pre><code>{
  "error": {
    "code": 1002,
    "type": "required_param",
    "message": "access_token の指定が必要です。"
  }
}</code></pre>
    </article>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      title: 'API 共通仕様',
    }
  },

  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style lang="scss" scoped>
.markdown-body {
  font-size: 14px;
}
</style>
