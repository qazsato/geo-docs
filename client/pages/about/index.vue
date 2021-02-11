<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" />
    </template>
    <article class="markdown-body">
      <h2>API 認証手段</h2>
      <p>
        Geo API の利用にはアクセストークンが必要です。<br />
        下記のようにアクセストークンをクエリパラメータに含めることで API の利用が可能となります。
      </p>
      <pre><code>$ curl https://api.geo.qazsato.com/v1/addresses?access_token={ACCESS_TOKEN}</code></pre>
      <p>
        アクセストークンの発行をご希望の方は、開発者へお問い合わせください。
      </p>

      <h2>リクエスト制限</h2>
      <p>
        Geo API では<b>1時間で最大1,000回</b>までのリクエストが可能です。<br />
        またレスポンスには、リクエスト制限を示す下記のヘッダ情報が付与されます。
      </p>
      <pre><code>X-Rate-Limit-Limit: 1000 # 期間内でリクエストできる最大回数
X-Rate-Limit-Reset: 3000 # 次の期間が来るまでの秒数
X-Rate-Limit-Remaining: 100 # 次の期間までにリクエストできる回数</code></pre>
      <p>
        リクエスト回数は、<b>毎時00分00秒</b>のタイミングでリセットされます。
      </p>
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
            <td>指定したリソースが存在しない</td>
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
      <h2>エラーレスポンス</h2>
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
      <h2>緯度経度の形式</h2>
      <p>Geo API で扱う緯度経度の形式は、 WGS84 (世界測地系) の 10 進数形式です。</p>
      <pre><code>{
  "location": {
    "lat": 35.68151,
    "lng": 139.76699
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
