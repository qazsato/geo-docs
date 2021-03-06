<template>
  <Page>
    <template #header>
      <Header :title="title" active="/addresses/about" />
    </template>
    <article class="markdown-body">
      <h2>住所データ</h2>
      <p>Geo API の住所データは、<b>4段階のレベル</b>に別れており、下記の階層となっています。</p>
      <table>
        <thead>
          <tr>
            <th>レベル</th>
            <th>分類</th>
            <th>コード桁数</th>
            <th>出力例 (code, name)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>都道府県</td>
            <td>2桁</td>
            <td>13, 東京都</td>
          </tr>
          <tr>
            <td>2</td>
            <td>市区町村</td>
            <td>5桁</td>
            <td>13101, 東京都千代田区</td>
          </tr>
          <tr>
            <td>3</td>
            <td>大字・町名</td>
            <td>9桁</td>
            <td>131010010, 東京都千代田区丸の内</td>
          </tr>
          <tr>
            <td>4</td>
            <td>字・丁目</td>
            <td>11桁</td>
            <td>13101001001, 東京都千代田区丸の内１丁目</td>
          </tr>
        </tbody>
      </table>
      <h2>住所ポリゴンデータ</h2>
      <p>
        住所ポリゴンデータは、住所データと同様に4段階のレベルに別れており、住所データとは<b>１対１の関係</b>となっています。<br />
        出力形式は、空間データの標準的なフォーマットの GeoJSON です。
      </p>
      <table>
        <thead>
          <tr>
            <th>レベル</th>
            <th>分類</th>
            <th>コード桁数</th>
            <th>出力例</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>都道府県</td>
            <td>2桁</td>
            <td>
              <a href="https://gist.github.com/qazsato/f3da1ff9377c91fb0096955279b2827a" target="_blank"
                >東京都のポリゴンデータ</a
              >
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>市区町村</td>
            <td>5桁</td>
            <td>
              <a href="https://gist.github.com/qazsato/dd594ab00779ff19b737c8c72b1099b6" target="_blank"
                >東京都千代田区のポリゴンデータ</a
              >
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>大字・町名</td>
            <td>9桁</td>
            <td>
              <a href="https://gist.github.com/qazsato/4bf08dfc5bd12748b1daec54143c1acd" target="_blank"
                >東京都千代田区丸の内のポリゴンデータ</a
              >
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>字・丁目</td>
            <td>11桁</td>
            <td>
              <a href="https://gist.github.com/qazsato/84a1c676f539b3340d4572a1c67cca3b" target="_blank"
                >東京都千代田区丸の内１丁目のポリゴンデータ</a
              >
            </td>
          </tr>
        </tbody>
      </table>
      <h2>出典</h2>
      <ul>
        <li>
          国土交通省国土数値情報ダウンロードサイト（<a href="https://nlftp.mlit.go.jp/index.html" target="_blank"
            >https://nlftp.mlit.go.jp/index.html</a
          >）
        </li>
        <ul>
          <li>「国土数値情報 行政区域データ, 位置参照情報」（国土交通省）を加工して作成</li>
        </ul>
        <li>
          政府統計の総合窓口(e-Stat)（<a href="https://www.e-stat.go.jp/" target="_blank">https://www.e-stat.go.jp/</a
          >）
        </li>
        <ul>
          <li>「国勢調査」（総務省）を加工して作成</li>
        </ul>
      </ul>
    </article>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      title: '住所について',
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
